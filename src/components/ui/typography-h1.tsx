import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface TypographyH1Props {
  className?: string;
}

export function TypographyH1({
  children,
  className,
}: PropsWithChildren<TypographyH1Props>) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  );
}
