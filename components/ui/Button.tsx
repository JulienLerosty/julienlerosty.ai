import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        "px-4 py-2 rounded-lg font-mono text-sm transition-all",
        "border backdrop-blur-glass",
        variant === "primary" &&
          "bg-accent-green/10 border-accent-green/40 text-accent-green hover:bg-accent-green/20 active:bg-accent-green/30",
        variant === "ghost" &&
          "bg-glass-fill border-glass-border text-fg hover:bg-glass-fillStrong",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...rest}
    />
  );
});
