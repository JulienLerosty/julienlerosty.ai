import { ReactNode, HTMLAttributes } from "react";
import { clsx } from "clsx";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "strong";
  children: ReactNode;
};

export function Glass({ variant = "default", className, children, ...rest }: Props) {
  return (
    <div className={clsx(variant === "strong" ? "glass-strong" : "glass", className)} {...rest}>
      {children}
    </div>
  );
}
