import type { RequestHandler } from "express";
import { config } from "./config.ts";

/**
 * A tiny in-memory limiter: fixed window, keyed per endpoint and per client address.
 *
 * It is deliberately simple — one process, one Map, no dependencies. It protects the
 * form endpoints from spam, not from a distributed flood; for that, put the API behind
 * a CDN/edge limiter.
 */

export const RATE_LIMIT_MESSAGE =
  "Too many submissions from this address. Please wait a minute and try again.";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
let lastSweepAt = Date.now();

/** Test seam: forget every recorded hit. */
export function resetRateLimits(): void {
  buckets.clear();
  lastSweepAt = Date.now();
}

function sweep(windowMs: number): void {
  const now = Date.now();
  if (now - lastSweepAt < windowMs) return;
  lastSweepAt = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitOptions {
  /** Endpoint label used as part of the bucket key. */
  name: string;
  max?: number;
  windowMs?: number;
}

export function createRateLimiter(options: RateLimitOptions): RequestHandler {
  const max = options.max ?? config.rateLimit.max;
  const windowMs = options.windowMs ?? config.rateLimit.windowMs;
  const enabled = config.rateLimit.enabled;

  return (req, res, next) => {
    res.setHeader("RateLimit-Limit", String(max));

    if (!enabled) {
      res.setHeader("RateLimit-Policy", "disabled");
      next();
      return;
    }

    const key = `${options.name}|${req.ip || "unknown"}`;
    const now = Date.now();
    sweep(windowMs);

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    const resetSeconds = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000));

    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(resetSeconds));

    if (bucket.count > max) {
      res.setHeader("Retry-After", String(resetSeconds > 0 ? resetSeconds : 1));
      res.status(429).json({ message: RATE_LIMIT_MESSAGE });
      return;
    }

    next();
  };
}
