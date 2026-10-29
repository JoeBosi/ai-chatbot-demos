"use client";

import { useActionState } from "react";

import { checkout, type CheckoutState } from "@/app/(shop)/carrello/actions";
import { Button } from "@/components/ui/button";

export function CheckoutForm() {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(checkout, {});
  const field = "mt-1 w-full rounded-md border bg-white px-3 py-2 text-base outline-none focus:border-enamel";

  return (
    <form action={action} className="mt-6 space-y-3 border-t pt-6">
      <p className="text-sm">
        Ordine di prova: <strong>nessun pagamento</strong>. Usa dati inventati; potrai poi chiedere al Barista lo stato dell&apos;ordine.
      </p>
      <label className="block text-sm">
        Nome e cognome
        <input name="name" required maxLength={80} autoComplete="off" defaultValue={state.fields?.name} className={field} />
      </label>
      <label className="block text-sm">
        Email
        <input name="email" type="email" required maxLength={120} autoComplete="off" defaultValue={state.fields?.email} className={field} placeholder="tu@example.com" />
      </label>
      <label className="block text-sm">
        Città
        <input name="city" required maxLength={80} autoComplete="off" defaultValue={state.fields?.city} className={field} />
      </label>
      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Invio l'ordine…" : "Conferma l'ordine di prova"}
      </Button>
    </form>
  );
}
