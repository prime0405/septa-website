import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline-mint" | "text";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium rounded-pill transition-[background,border-color,color,box-shadow,transform] duration-200 ease-out select-none whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-teal text-brand-pearl hover:bg-brand-teal-lift shadow-[0_10px_26px_-16px_rgb(6_24_32/0.45)] hover:shadow-[0_16px_34px_-14px_rgb(109_177_174/0.8)]",
  secondary: "bg-ink-raised text-fg border border-line hover:border-mint/55 hover:bg-surface-raised",
  "outline-mint": "border border-mint/45 text-mint hover:bg-mint/10 hover:border-mint",
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
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], block && "w-full", className);
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
      <Link to={to} className={classes} {...(linkRest as object)}>
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
    >
      {inner}
    </button>
  );
}
