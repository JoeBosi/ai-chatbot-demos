import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-5xl">Pagina non trovata</h1>
      <p className="text-muted-foreground mt-3">
        Il link potrebbe essere vecchio, oppure la prestazione non è più in elenco.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/prestazioni">Visite ed esami</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Torna alla home</Link>
        </Button>
      </div>
    </div>
  );
}
