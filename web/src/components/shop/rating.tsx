import { StarIcon } from "lucide-react";

export function Rating({ value, count, lang = "it" }: { value: number; count: number; lang?: "it" | "en" }) {
  return (
    <p className="text-muted-foreground flex items-center gap-1 text-sm" aria-label={lang === "en" ? `Rated ${value} out of 5, ${count} reviews` : `Valutazione ${value} su 5, ${count} recensioni`}>
      <StarIcon className="fill-enamel text-enamel size-3.5" aria-hidden />
      <span className="text-foreground font-medium">{value.toLocaleString(lang === "en" ? "en-GB" : "it-IT")}</span>
      <span>({count})</span>
    </p>
  );
}
