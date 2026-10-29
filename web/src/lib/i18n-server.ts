import "server-only";

import { headers } from "next/headers";

import { i18n, LANG_HEADER, type Lang } from "@/lib/i18n";

export async function getLang(): Promise<Lang> {
  return (await headers()).get(LANG_HEADER) === "en" ? "en" : "it";
}

export async function getI18n() {
  return i18n(await getLang());
}
