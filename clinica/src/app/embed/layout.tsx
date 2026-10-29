import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistente Poliambulatorio Vallenova",
  robots: { index: false, follow: false },
};

// The widget frames this page from other people's sites: keep it to the chat and nothing else.
export default function EmbedLayout({ children }: LayoutProps<"/embed">) {
  return <div className="h-dvh w-full overflow-hidden">{children}</div>;
}
