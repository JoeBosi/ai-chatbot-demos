import { cn } from "@/lib/utils";

// Pending text with a moving highlight; static when the visitor prefers reduced motion.
export function Shimmer({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block bg-[linear-gradient(90deg,var(--muted-foreground)_35%,var(--ink)_50%,var(--muted-foreground)_65%)] bg-[length:250%_100%] bg-clip-text text-transparent motion-safe:animate-[shimmer_1.6s_linear_infinite]",
        className,
      )}
    >
      {children}
    </span>
  );
}
