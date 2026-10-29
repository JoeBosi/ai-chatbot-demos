"use client";

import Link from "next/link";

import { useI18n } from "@/components/lang-provider";
import { createContext, useContext, useMemo, type ComponentProps, type ReactNode } from "react";

/**
 * What the browser side needs to know about the page it is running in:
 * - `embedded`: the chat is in an iframe on someone else's page, so a normal link would replace
 *   the chat with a shop page inside that little box. Embedded links open a new tab instead.
 * - `apiKey`: the public key the API asks for. It is not a secret (it is printed in the tutorial
 *   and travels to every visitor): it only keeps random scripts and crawlers off the endpoints.
 */
type ClientConfig = { embedded: boolean; apiKey?: string };

const ClientConfigContext = createContext<ClientConfig>({ embedded: false });

export function ClientConfigProvider({
  embedded = false,
  apiKey,
  children,
}: {
  embedded?: boolean;
  apiKey?: string;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ embedded, apiKey }), [embedded, apiKey]);
  return <ClientConfigContext.Provider value={value}>{children}</ClientConfigContext.Provider>;
}

export function useEmbedded() {
  return useContext(ClientConfigContext).embedded;
}

/** Headers every call to /api/chat and /api/cart must carry. */
export function useApiHeaders() {
  const { embedded, apiKey } = useContext(ClientConfigContext);
  return useMemo(() => {
    const headers: Record<string, string> = {};
    if (apiKey) headers["x-cf-key"] = apiKey;
    if (embedded) headers["x-cf-embed"] = "1";
    return headers;
  }, [embedded, apiKey]);
}

type SiteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function SiteLink({ href: path, children, onClick, ...props }: SiteLinkProps) {
  const embedded = useEmbedded();
  // Links from the chat stay in the page language: /prestazioni/x becomes /en/prestazioni/x on the English site.
  const href = useI18n().href(path);
  if (embedded) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
