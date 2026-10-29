import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { AssistantProvider } from "@/components/assistant/assistant-provider";
import { ClientConfigProvider } from "@/components/assistant/embed-context";
import { AssistantLauncher } from "@/components/assistant/launcher";
import { SiteFooter } from "@/components/sito/site-footer";
import { SiteHeader } from "@/components/sito/site-header";
import { getI18n } from "@/lib/i18n-server";

export default async function SitoLayout({ children }: LayoutProps<"/">) {
  const { t } = await getI18n();
  return (
    <ClientConfigProvider apiKey={process.env.WIDGET_PUBLIC_KEY}>
      <AssistantProvider>
        <a
          href="#contenuto"
          className="focus:bg-enamel sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:px-3 focus:py-2 focus:text-white"
        >
          {t("Vai al contenuto", "Skip to content")}
        </a>
        <SiteHeader />
        <main id="contenuto" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <AssistantLauncher />
        <AssistantPanel />
      </AssistantProvider>
    </ClientConfigProvider>
  );
}
