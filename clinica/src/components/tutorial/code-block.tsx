"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Code the reader is meant to copy: the file name says where it goes in the project. */
export function CodeBlock({ code, file, className }: { code: string; file?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the reader can still select the text */
    }
  };

  return (
    <figure className={cn("border-ink/15 bg-ink my-4 overflow-hidden rounded-lg border text-[13px]", className)}>
      <figcaption className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5 text-white/70">
        <span className="truncate font-mono text-xs">{file ?? "terminale"}</span>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white"
          aria-label={`Copia il codice${file ? ` di ${file}` : ""}`}
        >
          {copied ? <CheckIcon className="size-3.5" aria-hidden /> : <CopyIcon className="size-3.5" aria-hidden />}
          {copied ? "Copiato" : "Copia"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-3 py-3 text-white/90">
        <code className="font-mono leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </figure>
  );
}
