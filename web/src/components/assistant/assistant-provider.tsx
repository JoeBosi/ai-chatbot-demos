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

import { useApiHeaders, useEmbedded } from "@/components/assistant/embed-context";
import { useCart } from "@/components/shop/cart-provider";
import type { PageContext } from "@/lib/ai/instructions";
import type { ShopUIMessage } from "@/lib/ai/tools";

const STORAGE_KEY = "cf-barista-v1";
const EMBED_STORAGE_KEY = "cf-barista-embed-v1";

type AssistantContextValue = UseChatHelpers<ShopUIMessage> & {
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
  const { refresh: refreshCart } = useCart();
  const embedded = useEmbedded();
  const apiHeaders = useApiHeaders();
  const storageKey = embedded ? EMBED_STORAGE_KEY : STORAGE_KEY;

  const chat = useChat<ShopUIMessage>({
    // The public key opens the endpoint; the embed header tells the server the cart cookie must
    // work inside a third-party iframe.
    transport: new DefaultChatTransport<ShopUIMessage>({ api: "/api/chat", headers: apiHeaders }),
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
      if (saved) setMessages(JSON.parse(saved) as ShopUIMessage[]);
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

  // The assistant edits the server-side cart; keep the header badge and cart page in sync.
  const seenCartCalls = useRef(new Set<string>());
  useEffect(() => {
    let changed = false;
    for (const m of messages) {
      for (const p of m.parts) {
        if (p.type === "tool-addToCart" && p.state === "output-available" && !seenCartCalls.current.has(p.toolCallId)) {
          seenCartCalls.current.add(p.toolCallId);
          changed = true;
        }
      }
    }
    if (changed && restored.current) void refreshCart();
  }, [messages, refreshCart]);

  const ask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setOpen(true);
      if (status === "streaming" || status === "submitted") return;
      clearError();
      // The page context travels with each message, so "questa macchina" refers to the product on screen.
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
