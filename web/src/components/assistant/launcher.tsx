"use client";

import { MessageCircleIcon } from "lucide-react";

import { useAssistant } from "@/components/assistant/assistant-provider";

export function AssistantLauncher() {
  const { open, setOpen, messages } = useAssistant();
  if (open) return null;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="bg-enamel-deep hover:bg-enamel fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full py-3 pr-5 pl-4 text-white shadow-[0_12px_30px_-10px_rgba(18,58,47,0.7)] transition-colors"
    >
      <MessageCircleIcon className="size-5" aria-hidden />
      <span className="font-medium">{messages.length > 0 ? "Torna al Barista" : "Chiedi al Barista"}</span>
    </button>
  );
}
