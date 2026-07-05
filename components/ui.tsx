import { cn } from "@/lib/utils";
import * as React from "react";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "secondary" &&
          "border bg-card text-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border bg-card text-card-foreground shadow-panel", className)}
      {...props}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="h-10 w-full rounded-md border bg-card px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      {...props}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="h-10 w-full rounded-md border bg-card px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      {...props}
    />
  );
}
