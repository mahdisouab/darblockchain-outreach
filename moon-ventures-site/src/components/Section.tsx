import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerClassName?: string;
}

export function Section({
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-24 md:py-32", className)} {...props}>
      <div className={cn("max-w-6xl mx-auto px-6", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
