import { describe, expect, it } from "vitest";

import { replyLanguage } from "./reply-language";

describe("replyLanguage", () => {
  it("answers English questions in English, on any page", () => {
    expect(replyLanguage("/", "Which grinder do I need for the Vapora Classica?")).toBe("en");
    expect(replyLanguage(undefined, "How much is shipping to Sardinia?")).toBe("en");
  });
  it("answers Italian questions in Italian, even on the English pages", () => {
    expect(replyLanguage("/en", "Quanto costa la spedizione?")).toBe("it");
    expect(replyLanguage("/en/prodotti", "Vorrei una macchina per il cappuccino")).toBe("it");
  });
  it("uses the page language when the message gives no clue", () => {
    expect(replyLanguage("/en/prodotti", "CF-10482")).toBe("en");
    expect(replyLanguage("/prodotti", "CF-10482")).toBe("it");
  });
});
