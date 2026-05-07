import { forwardRef, ReactNode, HTMLAttributes } from "react";
import { clsx } from "clsx";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "strong";
  children: ReactNode;
};

export const Glass = forwardRef<HTMLDivElement, Props>(function Glass(
  { variant = "default", className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx(variant === "strong" ? "glass-strong" : "glass", className)}
      {...rest}
    >
      {children}
    </div>
  );
});
