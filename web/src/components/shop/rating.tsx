import { StarIcon } from "lucide-react";

export function Rating({ value, count }: { value: number; count: number }) {
  return (
    <p className="text-muted-foreground flex items-center gap-1 text-sm" aria-label={`Valutazione ${value} su 5, ${count} recensioni`}>
      <StarIcon className="fill-enamel text-enamel size-3.5" aria-hidden />
      <span className="text-foreground font-medium">{value.toLocaleString("it-IT")}</span>
      <span>({count})</span>
    </p>
  );
}
