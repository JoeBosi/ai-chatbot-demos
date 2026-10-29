import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { AssistantProvider } from "@/components/assistant/assistant-provider";
import { AssistantLauncher } from "@/components/assistant/launcher";
import { ClientConfigProvider } from "@/components/assistant/embed-context";
import { CartProvider } from "@/components/shop/cart-provider";
import { SiteFooter } from "@/components/shop/site-footer";
import { SiteHeader } from "@/components/shop/site-header";
import { getCart } from "@/lib/cart";

export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const cart = await getCart();
  return (
    <ClientConfigProvider apiKey={process.env.WIDGET_PUBLIC_KEY}>
      <CartProvider initialCart={cart}>
        <AssistantProvider>
          <a
            href="#contenuto"
            className="focus:bg-enamel sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:px-3 focus:py-2 focus:text-white"
          >
            Vai al contenuto
          </a>
          <SiteHeader />
          <main id="contenuto" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <AssistantLauncher />
          <AssistantPanel />
        </AssistantProvider>
      </CartProvider>
    </ClientConfigProvider>
  );
}
