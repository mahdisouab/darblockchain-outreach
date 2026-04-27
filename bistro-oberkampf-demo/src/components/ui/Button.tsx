import * as React from "react";

type Variant = "primary" | "ghost" | "outline" | "ghost-light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-inter font-medium tracking-wide rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bistro-forest focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-bistro-forest text-white hover:bg-bistro-charcoal shadow-sm hover:shadow-md",
  ghost:
    "bg-transparent text-bistro-forest hover:bg-bistro-forest/10",
  outline:
    "bg-transparent text-bistro-charcoal border border-bistro-charcoal/20 hover:border-bistro-forest hover:text-bistro-forest",
  "ghost-light":
    "bg-transparent text-white border border-white/70 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
