import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n-server";

export default async function NotFound() {
  const { t, href } = await getI18n();
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-5xl">{t("Pagina non trovata", "Page not found")}</h1>
      <p className="text-muted-foreground mt-3">
        {t("Il link potrebbe essere vecchio, oppure la prestazione non è più in elenco.", "The link may be out of date, or the service is no longer listed.")}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={href("/prestazioni")}>{t("Visite ed esami", "Visits and tests")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={href("/")}>{t("Torna alla home", "Back to the home page")}</Link>
        </Button>
      </div>
    </div>
  );
}
