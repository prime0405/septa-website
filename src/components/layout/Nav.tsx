import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { primaryNav, REQUEST_HREF, type NavItem } from "../../lib/nav";
import { paths } from "../../lib/paths";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { BrandLink } from "./Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes every open surface.
  useEffect(() => {
    setOpenGroup(null);
    setDrawer(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenGroup(null);
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawer]);

  const hoverOpen = useCallback((label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenGroup(label);
  }, []);

  const hoverClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 160);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 transition-[background,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled || openGroup || drawer
          ? "border-b border-line bg-[#0a1013]/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <BrandLink />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {primaryNav.map((item) =>
            item.groups ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hoverOpen(item.label)}
                onMouseLeave={hoverClose}
              >
                <NavTrigger
                  item={item}
                  open={openGroup === item.label}
                  onToggle={() =>
                    setOpenGroup((g) => (g === item.label ? null : item.label))
                  }
                />
                <MegaPanel item={item} open={openGroup === item.label} />
              </div>
            ) : (
              <DesktopLink key={item.href} item={item} />
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button to={REQUEST_HREF} size="sm" iconEnd={<ArrowRight className="size-4" />}>
            Request a Service
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setDrawer((d) => !d)}
          aria-expanded={drawer}
          aria-controls="mobile-drawer"
          className="flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-fg transition-colors hover:border-mint/45 lg:hidden"
        >
          <span className="sr-only">{drawer ? "Close menu" : "Open menu"}</span>
          {drawer ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      <AnimatePresence>
        {drawer ? <MobileDrawer onClose={() => setDrawer(false)} /> : null}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------- desktop ------------------------------- */

function DesktopLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.href}
      end={item.href === "/"}
      className={({ isActive }) =>
        cn(
          "relative rounded-lg px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
          isActive ? "text-mint" : "text-muted hover:text-fg",
        )
      }
    >
      {({ isActive }) => (
        <>
          {item.label}
          {isActive ? (
            <motion.span
              layoutId="nav-active"
              className="absolute inset-x-3 -bottom-px h-px bg-mint"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          ) : null}
        </>
      )}
    </NavLink>
  );
}

function NavTrigger({
  item,
  open,
  onToggle,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
}) {
  const active = useSectionActive(item.href, "/services");
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-haspopup="true"
      aria-controls={`mega-${item.label.replace(/\W/g, "")}`}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
        open || active ? "text-mint" : "text-muted hover:text-fg",
      )}
    >
      {item.label}
      <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} aria-hidden />
    </button>
  );
}

function useSectionActive(_href: string, match: string) {
  const { pathname } = useLocation();
  return pathname === match || pathname.startsWith(match + "/");
}

function MegaPanel({ item, open }: { item: NavItem; open: boolean }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={`mega-${item.label.replace(/\W/g, "")}`}
          role="region"
          aria-label={`${item.label} menu`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[calc(100%+10px)] left-1/2 w-[720px] -translate-x-1/2"
        >
          <div className="card grid grid-cols-[1fr_1fr_220px] gap-6 overflow-hidden p-5 shadow-[0_30px_70px_-40px_rgba(0,0,0,.95)]">
            {item.groups?.map((g) => (
              <div key={g.heading}>
                <p className="mb-3 font-mono text-[0.66rem] tracking-[0.18em] text-faint uppercase">
                  {g.heading}
                </p>
                <ul className="space-y-0.5">
                  {g.items.map((c) => (
                    <li key={c.href}>
                      <Link
                        to={c.href}
                        className="group block rounded-lg px-2.5 py-2 transition-colors hover:bg-surface"
                      >
                        <span className="flex items-center gap-1.5 text-[0.88rem] font-medium text-fg">
                          {c.label}
                          <ArrowRight className="size-3.5 -translate-x-1 text-mint opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                        {c.blurb ? (
                          <span className="mt-0.5 block text-[0.78rem] leading-snug text-faint">
                            {c.blurb}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="relative overflow-hidden rounded-card border border-mint/25 bg-[#101b20] p-4">
              <div aria-hidden className="dot-bg absolute inset-0 opacity-40" />
              <div className="relative">
                <Sparkles className="size-4 text-mint" aria-hidden />
                <p className="mt-2.5 text-[0.9rem] leading-snug text-fg">
                  Not sure which service fits?
                </p>
                <p className="mt-1 text-[0.78rem] text-muted">
                  Describe the outcome you want and we will map it to an approach.
                </p>
                <Button to={paths.request()} size="sm" variant="outline-mint" className="mt-3.5">
                  Request a Service
                </Button>
                <Link
                  to={item.href}
                  className="mt-3 block text-[0.78rem] text-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  All services
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------------------- mobile ------------------------------- */

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!nodes?.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <motion.div
        key="scrim"
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        key="panel"
        id="mobile-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onKeyDown={onKeyDown}
        initial={reduce ? { opacity: 0 } : { x: "100%" }}
        animate={reduce ? { opacity: 1 } : { x: 0 }}
        exit={reduce ? { opacity: 0 } : { x: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 38 }}
        className="fixed inset-y-0 right-0 z-50 flex w-[min(92vw,420px)] flex-col border-l border-line bg-[#0b1114] lg:hidden"
      >
        <div className="flex h-[72px] items-center justify-between border-b border-line px-4">
          <BrandLink label="Septa — close menu" />
          <button
            ref={firstRef}
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:border-rose/50 hover:text-rose"
          >
            <X className="size-5" aria-hidden />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                {item.groups ? (
                  <div className="rounded-card border border-line bg-[#10171c] p-1.5">
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "block rounded-lg px-3 py-2.5 text-[1rem] font-medium",
                          isActive ? "text-mint" : "text-fg",
                        )
                      }
                    >
                      Services
                    </NavLink>
                    <div className="mt-1 space-y-3 px-3 pb-2">
                      {item.groups.map((g) => (
                        <div key={g.heading}>
                          <p className="mb-1.5 font-mono text-[0.62rem] tracking-[0.16em] text-faint uppercase">
                            {g.heading}
                          </p>
                          <ul className="space-y-0.5">
                            {g.items.map((c) => (
                              <li key={c.href}>
                                <Link
                                  to={c.href}
                                  className="block rounded-lg px-2.5 py-2 text-[0.88rem] text-muted transition-colors hover:bg-surface hover:text-fg"
                                >
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={item.href}
                    end={item.href === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-xl px-3 py-3 text-[1.02rem] font-medium transition-colors",
                        isActive ? "bg-mint/10 text-mint" : "text-fg hover:bg-surface",
                      )
                    }
                  >
                    {item.label}
                    <ArrowRight className="size-4 opacity-40" aria-hidden />
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line p-4">
          <Button to={REQUEST_HREF} block size="lg" iconEnd={<ArrowRight className="size-4" />}>
            Request a Service
          </Button>
          <p className="mt-3 text-center text-[0.78rem] text-faint">
            Prefer email? Use the contact page and we will route it.
          </p>
        </div>
      </motion.div>
    </>
  );
}
