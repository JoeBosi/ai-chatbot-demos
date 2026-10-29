"use client";

import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { useApiHeaders, useEmbedded } from "@/components/assistant/embed-context";
import type { PageContext } from "@/lib/ai/instructions";
import type { ClinicUIMessage } from "@/lib/ai/tools";

const STORAGE_KEY = "vn-assistente-v1";
const EMBED_STORAGE_KEY = "vn-assistente-embed-v1";

type AssistantContextValue = UseChatHelpers<ClinicUIMessage> & {
  open: boolean;
  setOpen: (open: boolean) => void;
  ask: (text: string) => void;
  reset: () => void;
  pageContext: PageContext;
  setPageContext: (ctx: PageContext) => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext>({});
  const embedded = useEmbedded();
  const apiHeaders = useApiHeaders();
  const storageKey = embedded ? EMBED_STORAGE_KEY : STORAGE_KEY;

  const chat = useChat<ClinicUIMessage>({
    // The public key opens the endpoint; the embed header tells the server the chat is running
    // inside someone else's page.
    transport: new DefaultChatTransport<ClinicUIMessage>({ api: "/api/chat", headers: apiHeaders }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    throttle: 50,
  });
  const { messages, setMessages, sendMessage, status, stop, clearError } = chat;

  // Restore the conversation after a reload; storage may be unavailable (private mode).
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved) as ClinicUIMessage[]);
    } catch {
      /* ignore */
    }
  }, [setMessages, storageKey]);

  useEffect(() => {
    if (!restored.current || status === "streaming" || status === "submitted") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [messages, status, storageKey]);

  // A booking or a cancellation changes the agenda: the pages that show it (le mie prenotazioni)
  // are server-rendered, so they are refreshed instead of being left stale.
  const seenAgendaCalls = useRef(new Set<string>());
  const router = useRouter();
  useEffect(() => {
    let changed = false;
    for (const m of messages) {
      for (const p of m.parts) {
        const changesAgenda = p.type === "tool-bookAppointment" || p.type === "tool-cancelAppointment";
        if (changesAgenda && p.state === "output-available" && !seenAgendaCalls.current.has(p.toolCallId)) {
          seenAgendaCalls.current.add(p.toolCallId);
          changed = true;
        }
      }
    }
    if (changed && restored.current) router.refresh();
  }, [messages, router]);

  const ask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setOpen(true);
      if (status === "streaming" || status === "submitted") return;
      clearError();
      // The page context travels with each message, so "questa visita" refers to what is on screen.
      void sendMessage({ text: trimmed }, { body: { context: pageContext } });
    },
    [sendMessage, status, clearError, pageContext],
  );

  const reset = useCallback(() => {
    void stop();
    setMessages([]);
    clearError();
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [stop, setMessages, clearError, storageKey]);

  const value = useMemo(
    () => ({ ...chat, open, setOpen, ask, reset, pageContext, setPageContext }),
    [chat, open, ask, reset, pageContext],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside AssistantProvider");
  return ctx;
}
