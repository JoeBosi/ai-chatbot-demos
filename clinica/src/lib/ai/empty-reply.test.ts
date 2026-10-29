import { describe, expect, it } from "vitest";

import { EMPTY_REPLY_TEXT, guardEmptyReply } from "./empty-reply";

async function run(parts: { type: string; id?: string; text?: string }[]) {
  const out: { type: string; id?: string; text?: string }[] = [];
  const stream = new ReadableStream({
    start(c) {
      parts.forEach((p) => c.enqueue(p));
      c.close();
    },
  }).pipeThrough(guardEmptyReply());
  const reader = stream.getReader();
  for (let r = await reader.read(); !r.done; r = await reader.read()) out.push(r.value);
  return out;
}

describe("guardEmptyReply", () => {
  it("adds a courtesy text when the last step is empty after a tool call", async () => {
    const out = await run([
      { type: "start-step" },
      { type: "tool-call" },
      { type: "tool-result" },
      { type: "finish-step" },
      { type: "start-step" },
      { type: "finish-step" },
      { type: "finish" },
    ]);
    expect(out.some((p) => p.type === "text-delta" && p.text === EMPTY_REPLY_TEXT)).toBe(true);
    expect(out.at(-1)?.type).toBe("finish");
  });

  it("leaves a real answer alone", async () => {
    const out = await run([{ type: "start-step" }, { type: "text-start", id: "a" }, { type: "text-delta", id: "a", text: "Ciao" }, { type: "text-end", id: "a" }, { type: "finish-step" }, { type: "finish" }]);
    expect(out.filter((p) => p.type === "text-delta")).toHaveLength(1);
  });

  it("treats whitespace-only text as empty", async () => {
    const out = await run([{ type: "start-step" }, { type: "text-start", id: "a" }, { type: "text-delta", id: "a", text: "  \n" }, { type: "text-end", id: "a" }, { type: "finish" }]);
    expect(out.some((p) => p.text === EMPTY_REPLY_TEXT)).toBe(true);
  });

  it("does not add text while a booking waits for the click", async () => {
    const out = await run([{ type: "start-step" }, { type: "tool-approval-request" }, { type: "finish-step" }, { type: "finish" }]);
    expect(out.some((p) => p.text === EMPTY_REPLY_TEXT)).toBe(false);
  });

  it("turns leaked English reasoning into a hidden reasoning part and still answers", async () => {
    const leak = "The user is asking which doctor is on duty right now. I need to check the shifts of every doctor today.";
    const out = await run([
      { type: "start-step" },
      { type: "text-start", id: "a" },
      { type: "text-delta", id: "a", text: leak.slice(0, 30) },
      { type: "text-delta", id: "a", text: leak.slice(30) },
      { type: "text-end", id: "a" },
      { type: "finish-step" },
      { type: "finish" },
    ]);
    const visible = out.filter((p) => p.type === "text-delta").map((p) => p.text).join("");
    expect(visible).toBe(EMPTY_REPLY_TEXT);
    expect(out.some((p) => p.type === "reasoning-delta")).toBe(true);
  });

  it("streams a normal Italian answer in full", async () => {
    const out = await run([
      { type: "start-step" },
      { type: "text-start", id: "a" },
      { type: "text-delta", id: "a", text: "Oggi alle 21 nessun medico riceve. " },
      { type: "text-delta", id: "a", text: "Domani dalle 9 c'è il Dott. Bellani in cardiologia." },
      { type: "text-delta", id: "a", text: " Vuole prenotare?" },
      { type: "text-end", id: "a" },
      { type: "finish" },
    ]);
    const visible = out.filter((p) => p.type === "text-delta").map((p) => p.text).join("");
    expect(visible).toContain("Vuole prenotare?");
    expect(visible).not.toContain(EMPTY_REPLY_TEXT);
    expect(out.map((p) => p.type).filter((t) => t.startsWith("text"))).toEqual(["text-start", "text-delta", "text-delta", "text-end"]);
  });
});
