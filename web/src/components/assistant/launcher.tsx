"use client";

import { MessageCircleIcon } from "lucide-react";

import { useAssistant } from "@/components/assistant/assistant-provider";
import { useI18n } from "@/components/lang-provider";

export function AssistantLauncher() {
  const { open, setOpen, messages } = useAssistant();
  const { t } = useI18n();
  if (open) return null;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="bg-enamel-deep hover:bg-enamel fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full py-3 pr-5 pl-4 text-white shadow-[0_12px_30px_-10px_rgba(18,58,47,0.7)] transition-colors"
    >
      <MessageCircleIcon className="size-5" aria-hidden />
      <span className="font-medium">{messages.length > 0 ? t("Torna al Barista", "Back to the Barista") : t("Chiedi al Barista", "Ask the Barista")}</span>
    </button>
  );
}
