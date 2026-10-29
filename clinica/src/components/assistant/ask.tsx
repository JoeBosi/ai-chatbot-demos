"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { useAssistant } from "@/components/assistant/assistant-provider";
import type { PageContext } from "@/lib/ai/instructions";
import { cn } from "@/lib/utils";

// A question box outside the panel: typing here opens the assistant with the question.
export function AskBox({ placeholder, suggestions, className }: { placeholder: string; suggestions: string[]; className?: string }) {
  const { ask } = useAssistant();
  const [value, setValue] = useState("");
  const inputId = useId();
  return (
    <div className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          ask(value);
          setValue("");
        }}
        className="focus-within:border-enamel flex items-center gap-2 rounded-full border-2 border-transparent bg-white p-1.5 pl-5 shadow-[0_2px_0_0_var(--enamel-deep)]"
      >
        <label htmlFor={inputId} className="sr-only">
          Faccia una domanda all’assistente
        </label>
        <input
          id={inputId}
          value={value}
          maxLength={1000}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none"
        />
        <button
          type="submit"
          aria-label="Chiedi"
          className="bg-enamel hover:bg-enamel-deep flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors"
        >
          <ArrowUpIcon className="size-5" aria-hidden />
        </button>
      </form>
      <ul className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <li key={s}>
            <AskChip question={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AskChip({ question, label, className }: { question: string; label?: string; className?: string }) {
  const { ask } = useAssistant();
  return (
    <button
      type="button"
      onClick={() => ask(question)}
      className={cn("hover:border-enamel hover:text-enamel-deep rounded-full border border-current/20 px-3 py-1.5 text-left text-sm transition-colors", className)}
    >
      {label ?? question}
    </button>
  );
}

// Dice all'assistente in che pagina si trova il paziente: così "questa visita" o "lui" si
// riferiscono a ciò che ha sullo schermo.
export function AssistantPageContext(context: PageContext) {
  const { setPageContext } = useAssistant();
  const { path, serviceSlug, serviceName, doctorSlug, doctorName } = context;
  useEffect(() => {
    setPageContext({ path, serviceSlug, serviceName, doctorSlug, doctorName });
    return () => setPageContext({});
  }, [setPageContext, path, serviceSlug, serviceName, doctorSlug, doctorName]);
  return null;
}
