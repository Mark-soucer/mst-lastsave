import React from "react";

/** Bun venit — composed with lucide icon */
export type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}