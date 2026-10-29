// Free models misbehave in two ways the page must never show:
// - they call a tool and then close the turn with an empty step (sources, no answer);
// - they write their own reasoning as the answer ("The user is asking…", "Il paziente chiede…").
// Each text block is held back until its opening is known: reasoning goes out as a reasoning part,
// which the panel does not show. If the last step ends with no real text and nothing waits for the
// customer's click, a courtesy line is added, so the bubble is never empty.
export const EMPTY_REPLY_TEXT_EN =
  "I couldn't put the answer together. Could you try again or rephrase the question? Products and prices are also in the site's catalogue.";

export const EMPTY_REPLY_TEXT =
  "Non sono riuscito a formulare la risposta. Può riprovare o riformulare la domanda? Prodotti e prezzi sono anche nel catalogo del sito.";

// Only openings no real answer would use: English answers may well start with "Okay" or "Based on".
const LEAKED_REASONING =
  /^\s*(the user|user (is|asks|wants)|i need to|i should (call|check|use|search)|let me (check|look|search|call|find|see|use)|we need to|now,? i (need|will|should)|looking at the (data|tool|results|output)|il (paziente|cliente) (chiede|vuole|sta)|l'utente|devo |ora devo)/i;
const DECIDE_AFTER = 60;

type Part = { type: string; id?: string; text?: string };

export function guardEmptyReply<T extends Part>(courtesy = EMPTY_REPLY_TEXT): TransformStream<T, T> {
  let textInStep = false;
  let waitsForApproval = false;
  // Text blocks still being judged, and the verdict for those already judged.
  const pending = new Map<string, string>();
  const asReasoning = new Set<string>();

  const emit = (c: TransformStreamDefaultController<T>, part: Part) => c.enqueue(part as T);
  const decide = (c: TransformStreamDefaultController<T>, id: string) => {
    const text = pending.get(id) ?? "";
    pending.delete(id);
    if (LEAKED_REASONING.test(text)) {
      asReasoning.add(id);
      emit(c, { type: "reasoning-start", id });
      if (text) emit(c, { type: "reasoning-delta", id, text });
      return;
    }
    emit(c, { type: "text-start", id });
    if (text) {
      emit(c, { type: "text-delta", id, text });
      if (text.trim()) textInStep = true;
    }
  };

  return new TransformStream<T, T>({
    transform(part, controller) {
      const id = part.id ?? "";
      switch (part.type) {
        case "start-step":
          textInStep = false;
          break;
        case "tool-approval-request":
          waitsForApproval = true;
          break;
        case "text-start":
          pending.set(id, "");
          return;
        case "text-delta":
          if (pending.has(id)) {
            const text = pending.get(id)! + (part.text ?? "");
            pending.set(id, text);
            if (text.trimStart().length >= DECIDE_AFTER) decide(controller, id);
            return;
          }
          if (asReasoning.has(id)) return emit(controller, { type: "reasoning-delta", id, text: part.text });
          if (part.text?.trim()) textInStep = true;
          break;
        case "text-end":
          if (pending.has(id)) decide(controller, id);
          if (asReasoning.has(id)) {
            asReasoning.delete(id);
            return emit(controller, { type: "reasoning-end", id });
          }
          break;
        case "finish":
          if (!textInStep && !waitsForApproval) {
            const fid = "empty-reply";
            emit(controller, { type: "text-start", id: fid });
            emit(controller, { type: "text-delta", id: fid, text: courtesy });
            emit(controller, { type: "text-end", id: fid });
          }
          break;
      }
      controller.enqueue(part);
    },
  });
}
