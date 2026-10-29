// Which language the answer must be in. The free models tend to follow the (Italian) instructions
// and tool data rather than the customer, so the server decides and says it plainly.
const EN = /\b(the|is|are|do|does|you|your|what|which|how|where|when|can|could|i|my|me|need|want|for|with|and|to|of|a|an|it|have|there|please|thanks|hi|hello)\b/gi;
const IT = /\b(il|lo|la|gli|le|un|una|che|di|del|della|per|con|non|è|sono|mi|ti|ho|hai|come|dove|quando|quanto|quale|vorrei|posso|grazie|ciao|buongiorno)\b/gi;

export function replyLanguage(path: string | undefined, text: string): "it" | "en" {
  const en = text.match(EN)?.length ?? 0;
  const it = text.match(IT)?.length ?? 0;
  if (en > it) return "en";
  if (it > en) return "it";
  return path === "/en" || path?.startsWith("/en/") ? "en" : "it";
}
