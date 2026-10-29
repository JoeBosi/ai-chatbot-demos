"use client";

import { RotateCcwIcon, SparklesIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/assistant/shimmer";
import { useAssistant } from "@/components/assistant/assistant-provider";
import { useEmbedded } from "@/components/assistant/embed-context";
import { useI18n } from "@/components/lang-provider";
import {
  AddToCartPart,
  CompareProductsPart,
  GetCartPart,
  GetProductPart,
  SearchHelpPart,
  SearchProductsPart,
  SupportTicketPart,
  TrackOrderPart,
} from "@/components/assistant/tool-parts";
import { Button } from "@/components/ui/button";
import type { ShopUIMessage } from "@/lib/ai/tools";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 1000;

const starters = {
  it: [
    "Quale macchina espresso mi consigli per iniziare?",
    "Che macinacaffè serve per la Vapora Classica?",
    "Posso restituire un prodotto aperto?",
    "Dov'è il mio ordine CF-10482? Email demo@cremaeferro.it",
  ],
  en: [
    "Which espresso machine do you recommend for a beginner?",
    "Which grinder do I need for the Vapora Classica?",
    "Can I return an opened product?",
    "Where is my order CF-10482? Email demo@cremaeferro.it",
  ],
};

function errorText(error: Error, fallback: string) {
  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    /* not JSON */
  }
  return error.message && error.message.length < 200 ? error.message : fallback;
}

export function AssistantPanel({ hostOrigin }: { hostOrigin?: string }) {
  const { open, setOpen, messages, status, error, ask, reset, regenerate, stop, addToolApprovalResponse, pageContext } = useAssistant();
  const embedded = useEmbedded();
  const { t, lang } = useI18n();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  // Embedded, the chat fills the iframe: closing is the host page's job, so ask it to close the frame.
  const close = useCallback(() => {
    if (embedded) {
      window.parent?.postMessage({ type: "cf-widget", action: "close" }, hostOrigin || "*");
      return;
    }
    setOpen(false);
  }, [embedded, hostOrigin, setOpen]);

  useEffect(() => {
    if (!open && !embedded) return;
    const t = setTimeout(() => textareaRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, embedded, close]);

  if (!open && !embedded) return null;

  const closeOnMobile = () => {
    if (!embedded && window.matchMedia("(max-width: 767px)").matches) setOpen(false);
  };

  const submit = () => {
    if (!input.trim() || busy) return;
    ask(input.slice(0, MAX_LENGTH));
    setInput("");
  };

  const last = messages.at(-1);
  const waitingForFirstToken = status === "submitted" || (status === "streaming" && last?.role === "assistant" && last.parts.every((p) => p.type === "step-start"));

  return (
    <section
      ref={panelRef}
      role="dialog"
      aria-label={t("Il Barista, assistente del negozio", "The Barista, the shop assistant")}
      className={cn(
        "bg-background flex flex-col",
        embedded
          ? "h-dvh w-full"
          : "panel-enter fixed inset-0 z-50 md:inset-auto md:right-4 md:bottom-4 md:h-[min(760px,calc(100dvh-2rem))] md:w-[440px] md:rounded-xl md:border md:shadow-[0_24px_60px_-20px_rgba(18,58,47,0.45)]",
      )}
    >
      <header className={cn("bg-enamel-deep flex items-center gap-3 px-4 py-3 text-white", !embedded && "md:rounded-t-xl")}>
        <div className="flex size-9 items-center justify-center rounded-full bg-white/10">
          <SparklesIcon className="size-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-none">Il Barista</p>
          <p className="truncate text-xs text-white/70">
            {pageContext.productName ? t(`Stai guardando: ${pageContext.productName}`, `Looking at: ${pageContext.productName}`) : t("Consigli, ordini e assistenza", "Advice, orders and support")}
          </p>
        </div>
        {messages.length > 0 && (
          <Button size="icon-sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={reset} aria-label={t("Nuova conversazione", "New conversation")} title={t("Nuova conversazione", "New conversation")}>
            <RotateCcwIcon />
          </Button>
        )}
        <Button size="icon-sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={close} aria-label={t("Chiudi l'assistente", "Close the assistant")}>
          <XIcon />
        </Button>
      </header>

      <Conversation className="min-h-0">
        <ConversationContent className="gap-5 px-4 py-5">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-display text-2xl leading-tight">{t("Ciao, cosa prepariamo oggi?", "Hi, what are we making today?")}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t("Consigli, carrello, ordini e assistenza.", "Advice, cart, orders and support.")}
                </p>
              </div>
              <ul className="flex flex-col gap-2">
                {starters[lang].map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => ask(s)} className="hover:border-enamel hover:bg-enamel-soft w-full rounded-md border bg-white px-3 py-2 text-left text-sm transition-colors">
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            messages.map((message) => (
              <MessageView
                key={message.id}
                message={message}
                onNavigate={closeOnMobile}
                onApproval={(id, approved) => addToolApprovalResponse({ id, approved })}
              />
            ))
          )}
          {waitingForFirstToken && (
            <div className="text-muted-foreground text-sm">
              <Shimmer>{t("Il Barista sta pensando…", "The Barista is thinking…")}</Shimmer>
            </div>
          )}
          {error && (
            <div role="alert" className="border-destructive/30 bg-destructive/5 rounded-md border p-3 text-sm">
              <p>{errorText(error, t("Il Barista non riesce a rispondere in questo momento.", "The Barista cannot answer right now."))}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => regenerate()}>
                {t("Riprova", "Try again")}
              </Button>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <form
        className={cn("border-t bg-white p-3", !embedded && "md:rounded-b-xl")}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="barista-input" className="sr-only">
          {t("Scrivi al Barista", "Write to the Barista")}
        </label>
        <div className="focus-within:border-enamel flex items-end gap-2 rounded-lg border px-3 py-2">
          <textarea
            id="barista-input"
            ref={textareaRef}
            value={input}
            maxLength={MAX_LENGTH}
            rows={1}
            placeholder={t("Scrivi una domanda…", "Type a question…")}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            className="max-h-32 min-h-6 flex-1 resize-none bg-transparent text-base outline-none field-sizing-content md:text-sm"
          />
          {busy ? (
            <Button type="button" size="sm" variant="outline" onClick={() => stop()}>
              {t("Ferma", "Stop")}
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={!input.trim()}>
              {t("Invia", "Send")}
            </Button>
          )}
        </div>
        <p className="text-muted-foreground mt-2 text-[11px] leading-snug">
          {t(
            "Demo con modelli AI gratuiti: le risposte possono contenere errori. Le conversazioni vengono salvate per migliorare la demo, non inserire dati personali reali.",
            "Demo with free AI models: answers may contain mistakes. Conversations are saved to improve the demo, so do not enter real personal data.",
          )}
        </p>
      </form>
    </section>
  );
}

function MessageView({
  message,
  onNavigate,
  onApproval,
}: {
  message: ShopUIMessage;
  onNavigate: () => void;
  onApproval: (id: string, approved: boolean) => void;
}) {
  const isUser = message.role === "user";
  const { t } = useI18n();
  const preamble = preambleTextIndexes(message);
  return (
    <Message from={message.role} className={cn(!isUser && "max-w-full")}>
      <MessageContent className={cn(isUser ? "bg-enamel text-white" : "w-full gap-3 bg-transparent p-0")}>
        {message.parts.map((part, i) => {
          const key = `${message.id}-${i}`;
          switch (part.type) {
            case "text":
              if (!isUser && preamble.has(i)) return null;
              return isUser ? (
                <p key={key} className="whitespace-pre-wrap">
                  {part.text}
                </p>
              ) : (
                <MessageResponse key={key}>{part.text}</MessageResponse>
              );
            case "tool-searchProducts":
              return <SearchProductsPart key={key} part={part} onNavigate={onNavigate} />;
            case "tool-getProduct":
              return <GetProductPart key={key} part={part} onNavigate={onNavigate} />;
            case "tool-compareProducts":
              return <CompareProductsPart key={key} part={part} />;
            case "tool-addToCart":
              return <AddToCartPart key={key} part={part} onNavigate={onNavigate} />;
            case "tool-getCart":
              return <GetCartPart key={key} part={part} onNavigate={onNavigate} />;
            case "tool-trackOrder":
              return <TrackOrderPart key={key} part={part} />;
            case "tool-searchHelp":
              return <SearchHelpPart key={key} part={part} onNavigate={onNavigate} />;
            case "tool-createSupportTicket":
              return <SupportTicketPart key={key} part={part} onRespond={onApproval} />;
            default:
              return null;
          }
        })}
        {!isUser && message.metadata?.model && (
          <p className="text-muted-foreground text-[11px]">{t("Risposta di", "Answer from")} {message.metadata.model}</p>
        )}
      </MessageContent>
    </Message>
  );
}

/**
 * Some free models write their reasoning as plain text before calling a tool ("The user is asking…
 * let me call searchServices"). The real answer always comes in a later step, after the tool
 * result, so any text in a step that also contains a tool call is hidden: a step is the run of
 * parts between two `step-start` markers.
 */
function preambleTextIndexes(message: { parts: { type: string }[] }) {
  const hidden = new Set<number>();
  let step: number[] = [];
  let stepHasTool = false;
  const close = () => {
    if (stepHasTool) for (const i of step) hidden.add(i);
    step = [];
    stepHasTool = false;
  };
  message.parts.forEach((part, i) => {
    if (part.type === "step-start") return close();
    if (part.type === "text") step.push(i);
    else if (part.type.startsWith("tool-")) stepHasTool = true;
  });
  close();
  return hidden;
}
