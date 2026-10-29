import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { AssistantProvider } from "@/components/assistant/assistant-provider";
import { ClientConfigProvider } from "@/components/assistant/embed-context";

// An origin and nothing else: it is echoed back as the postMessage target, so it must not be a
// full URL with a path, and anything odd falls back to "*" (a close request carries no data).
const ORIGIN = /^https?:\/\/[a-z0-9.-]+(:\d{1,5})?$/i;

export default async function EmbedPage({ searchParams }: PageProps<"/embed">) {
  const { host } = await searchParams;
  const hostOrigin = typeof host === "string" && ORIGIN.test(host) ? host : undefined;

  return (
    <ClientConfigProvider embedded apiKey={process.env.WIDGET_PUBLIC_KEY}>
      <AssistantProvider>
        <AssistantPanel hostOrigin={hostOrigin} />
      </AssistantProvider>
    </ClientConfigProvider>
  );
}
