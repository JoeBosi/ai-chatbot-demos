import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n-server";

export default async function NotFound() {
  const { t, href } = await getI18n();
  return (
    <div className="mx-auto max-w-xl px-4 pt-20 text-center">
      <h1 className="font-display text-5xl">{t("Pagina non trovata", "Page not found")}</h1>
      <p className="text-muted-foreground mt-3">
        {t("Il link potrebbe essere vecchio o il prodotto non più a catalogo.", "The link may be out of date or the product no longer in the catalogue.")}
      </p>
      <Button asChild className="mt-6">
        <Link href={href("/prodotti")}>{t("Vai ai prodotti", "Go to the products")}</Link>
      </Button>
    </div>
  );
}
