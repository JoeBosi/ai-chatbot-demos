import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 pt-20 text-center">
      <h1 className="font-display text-5xl">Pagina non trovata</h1>
      <p className="text-muted-foreground mt-3">Il link potrebbe essere vecchio o il prodotto non più a catalogo.</p>
      <Button asChild className="mt-6">
        <Link href="/prodotti">Vai ai prodotti</Link>
      </Button>
    </div>
  );
}
