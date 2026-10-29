import { cn } from "@/lib/utils";

// Flat line illustrations drawn for the demo, so the shop needs no stock photos.
// Every drawing shares one 120×120 grid, an ink stroke and the product's own colour.

type Props = { art: string; color: string; className?: string; title?: string };

const INK = "#1b2420";

function tint(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function ProductArt({ art, color, className, title }: Props) {
  const s = { stroke: INK, strokeWidth: 2.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <div className={cn("relative flex aspect-square items-center justify-center overflow-hidden", className)} style={{ background: tint(color, 0.14) }}>
      <svg viewBox="0 0 120 120" className="h-[78%] w-[78%]" role="img" aria-label={title ?? "Illustrazione del prodotto"}>
        <ellipse cx="60" cy="104" rx="40" ry="5" fill={tint("#1b2420", 0.1)} />
        {drawing(art, color, s)}
      </svg>
    </div>
  );
}

type Stroke = { stroke: string; strokeWidth: number; strokeLinejoin: "round"; strokeLinecap: "round" };

function drawing(art: string, color: string, s: Stroke) {
  switch (art) {
    case "espresso":
      return (
        <g {...s}>
          <rect x="26" y="22" width="68" height="16" rx="4" fill={color} />
          <rect x="30" y="38" width="60" height="62" rx="3" fill="#fff" />
          <rect x="30" y="92" width="60" height="10" rx="2" fill={color} />
          <path d="M52 50h16v8H52z" fill="#c9cfcc" />
          <path d="M40 58h40" />
          <path d="M60 58v6" />
          <path d="M60 64c-10 0-12 4-24 4" />
          <rect x="52" y="76" width="16" height="14" rx="2" fill="#fff" />
          <circle cx="78" cy="46" r="4" fill="#fff" />
        </g>
      );
    case "espresso-dual":
      return (
        <g {...s}>
          <rect x="16" y="24" width="88" height="14" rx="4" fill={color} />
          <rect x="20" y="38" width="80" height="58" rx="3" fill="#fff" />
          <rect x="20" y="92" width="80" height="10" rx="2" fill={color} />
          <circle cx="42" cy="50" r="6" fill="#fff" />
          <circle cx="78" cy="50" r="6" fill="#fff" />
          <path d="M34 64h16M70 64h16" />
          <path d="M42 64v5M78 64v5" />
          <rect x="35" y="78" width="14" height="12" rx="2" fill="#fff" />
          <rect x="71" y="78" width="14" height="12" rx="2" fill="#fff" />
          <path d="M60 40v48" strokeDasharray="2 4" />
        </g>
      );
    case "grinder":
      return (
        <g {...s}>
          <path d="M40 14h40l-8 30H48z" fill={tint(color, 0.35)} />
          <rect x="40" y="44" width="40" height="44" rx="4" fill={color} />
          <circle cx="60" cy="58" r="7" fill="#fff" />
          <path d="M60 58l4-4" />
          <path d="M52 76h16v10H52z" fill="#fff" />
          <rect x="34" y="88" width="52" height="14" rx="3" fill="#fff" />
          <path d="M50 22c3 4 6 4 9 0s6-4 9 0" />
        </g>
      );
    case "beans":
      return (
        <g {...s}>
          <path d="M34 22h52l6 80H28z" fill={color} />
          <path d="M34 22l6-8h40l6 8" fill="#fff" />
          <rect x="40" y="48" width="40" height="30" rx="2" fill="#fff" />
          <ellipse cx="60" cy="63" rx="8" ry="11" fill={tint(color, 0.3)} />
          <path d="M60 53c-4 6 4 14 0 20" />
          <circle cx="60" cy="32" r="3" fill="#fff" />
        </g>
      );
    case "moka":
      return (
        <g {...s}>
          <path d="M44 20h32l-4 34H48z" fill="#fff" />
          <path d="M42 20h36" />
          <path d="M60 12v8" />
          <path d="M76 26h10c4 0 4 20-2 22l-10 2" fill="none" />
          <path d="M48 54h24l8 46H40z" fill={color} />
          <path d="M44 54h32" />
          <path d="M48 78h24" stroke="#fff" />
        </g>
      );
    case "pourover":
      return (
        <g {...s}>
          <path d="M28 26h64L70 62H50z" fill={color} />
          <path d="M22 62h76" />
          <path d="M40 34l10 22M60 32v24M80 34L70 56" stroke={tint("#1b2420", 0.5)} />
          <path d="M36 66h48v28c0 8-8 10-24 10s-24-2-24-10z" fill="#fff" />
          <path d="M60 64v10" strokeDasharray="1 4" />
        </g>
      );
    case "press":
      return (
        <g {...s}>
          <path d="M60 8v18" />
          <circle cx="60" cy="8" r="4" fill={color} />
          <rect x="38" y="24" width="44" height="8" rx="2" fill={color} />
          <rect x="40" y="32" width="40" height="68" rx="3" fill="#fff" />
          <rect x="40" y="58" width="40" height="42" fill={tint("#5a3a26", 0.55)} />
          <path d="M80 44h8c4 0 4 36 0 36h-8" fill="none" />
          <path d="M40 58h40" strokeWidth={3} />
        </g>
      );
    case "kettle":
      return (
        <g {...s}>
          <path d="M34 50h48l4 50H30z" fill={color} />
          <path d="M40 50c0-10 36-10 36 0" fill="#fff" />
          <path d="M82 60c10 0 12 10 8 20" fill="none" />
          <path d="M34 62C20 58 14 44 8 36" fill="none" strokeWidth={3} />
          <rect x="26" y="98" width="64" height="6" rx="2" fill="#fff" />
        </g>
      );
    case "scale":
      return (
        <g {...s}>
          <rect x="18" y="62" width="84" height="30" rx="6" fill={color} />
          <rect x="30" y="54" width="60" height="8" rx="2" fill="#fff" />
          <rect x="40" y="70" width="40" height="14" rx="2" fill="#fff" />
          <path d="M46 77h6M56 77h6M66 77h8" />
          <path d="M48 54c0-14 24-14 24 0" fill={tint(color, 0.25)} />
        </g>
      );
    case "cup":
      return (
        <g {...s}>
          <ellipse cx="60" cy="96" rx="36" ry="7" fill="#fff" />
          <path d="M38 52h44l-4 32c-1 8-8 10-18 10s-17-2-18-10z" fill={color} />
          <ellipse cx="60" cy="52" rx="22" ry="5" fill={tint("#5a3a26", 0.7)} />
          <path d="M82 60c10 0 10 14 0 16" fill="none" />
          <path d="M52 30c-4 6 4 8 0 14M64 26c-4 6 4 8 0 14" stroke={tint("#1b2420", 0.5)} />
        </g>
      );
    case "tamper":
      return (
        <g {...s}>
          <path d="M50 20c0-8 20-8 20 0l4 46H46z" fill={color} />
          <rect x="42" y="66" width="36" height="8" rx="2" fill="#fff" />
          <path d="M34 74h52l-2 22H36z" fill="#c9cfcc" />
        </g>
      );
    case "pitcher":
      return (
        <g {...s}>
          <path d="M36 32h42l6 66H34z" fill={color} />
          <path d="M36 32l-12-6 16-2" fill="#fff" />
          <path d="M84 44c12 0 12 30 0 34" fill="none" />
          <path d="M42 50h30" stroke="#fff" />
        </g>
      );
    default:
      return (
        <g {...s}>
          <rect x="36" y="34" width="34" height="66" rx="5" fill={color} />
          <rect x="42" y="22" width="22" height="12" rx="2" fill="#fff" />
          <rect x="42" y="56" width="22" height="22" rx="2" fill="#fff" />
          <path d="M76 100l18-44" strokeWidth={3} />
          <path d="M90 50l10 4-4 10-10-4z" fill={tint(color, 0.4)} />
        </g>
      );
  }
}
