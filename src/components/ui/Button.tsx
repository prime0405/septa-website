import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { usePointerTrack } from "../../lib/pointerGlow";

type Variant = "primary" | "secondary" | "ghost" | "outline-mint" | "outline-light" | "dark-cta" | "text";
type Size = "sm" | "md" | "lg";

// Tailwind v4 compiles both the magnet below and the press at the end of this list to the `translate`
// property rather than to `transform`, so naming `transform` here would ease nothing and the drift
// would snap frame to frame with the pointer.
const base =
  "relative inline-flex items-center justify-center gap-2 font-medium rounded-pill transition-[background,border-color,color,box-shadow,translate] duration-200 ease-out select-none whitespace-nowrap max-[359px]:whitespace-normal disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]";

// Set only on a magnetic button, so the pull is a translate and the press stays a translate.
const magnet = "translate-x-[var(--tx,0px)] translate-y-[var(--ty,0px)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-teal text-brand-pearl hover:bg-brand-teal-lift shadow-[0_10px_26px_-16px_rgb(6_24_32/0.45)] hover:shadow-[0_16px_34px_-14px_rgb(109_177_174/0.8)]",
  secondary: "bg-ink-raised text-fg border border-line hover:border-mint/55 hover:bg-surface-raised",
  "outline-mint": "border border-mint/45 text-mint hover:bg-mint/10 hover:border-mint",
  /* The two buttons the dark homepage hero takes. `dark-cta` is the #5fdd9d fill with Black Pearl
     on it — 10.6:1 — and `outline-light` is the same green held to a hairline around white type so
     the secondary action reads as paired with the fill rather than as a light-page button that
     wandered onto a charcoal field. Both are separate variants rather than className overrides
     because `cn` is clsx, which does not deduplicate conflicting utilities. */
  "dark-cta":
    "bg-brand-mint text-brand-pearl hover:bg-brand-mint/85 shadow-[0_14px_34px_-16px_rgb(95_221_157/0.55)]",
  "outline-light":
    "border border-brand-white/35 text-brand-white hover:border-brand-mint/70 hover:bg-brand-mint/10",
  ghost: "text-muted hover:text-fg hover:bg-surface",
  text: "text-mint hover:text-mint-bright underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.8rem] px-3.5 py-2",
  md: "text-[0.925rem] px-5 py-2.5",
  lg: "text-[1rem] px-6.5 py-3.5",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  block?: boolean;
  /** Drift a few pixels toward the cursor while it is over the button. */
  magnetic?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    to?: undefined;
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  to: string;
  href?: undefined;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

type ButtonAsAnchor = CommonProps & {
  href: string;
  to?: undefined;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    iconStart,
    iconEnd,
    block,
    magnetic,
    ...rest
  } = props;

  const track = usePointerTrack<HTMLElement>("magnet");
  const handlers = magnetic ? track : {};

  const classes = cn(base, variants[variant], sizes[size], block && "w-full", magnetic && magnet, className);
  const inner = (
    <>
      {iconStart}
      {children}
      {iconEnd}
    </>
  );

  if ("to" in props && props.to !== undefined) {
    const { to, ...linkRest } = rest as { to: string };
    return (
      <Link to={to} className={classes} {...(linkRest as object)} {...handlers}>
        {inner}
      </Link>
    );
  }

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as { href: string };
    return (
      <a
        href={href}
        className={classes}
        rel={(props as ButtonAsAnchor).rel ?? "noreferrer"}
        {...(anchorRest as object)}
        {...handlers}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={(props as ButtonAsButton).type ?? "button"}
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      {...handlers}
    >
      {inner}
    </button>
  );
}
