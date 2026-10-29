import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";

// English version of «Com'è fatta questa demo». Same facts as the Italian page.
const real = [
  ["The site", "Pages, lists, filters and detail pages are a real Next.js application, with data read from a Postgres database."],
  [
    "The availability calculation",
    "Free slots are not a hand-written list: they are worked out every time from the doctors' weekly shifts, minus closures, minus appointments already taken, with at least 24 hours' notice.",
  ],
  [
    "The database",
    "Bookings are really written, with a uniqueness constraint that stops two people taking the same time with the same doctor. If they try, the second one gets an honest error.",
  ],
  [
    "An assistant that uses tools",
    "It does not follow a script: it searches the services, reads the information pages, works out availability and books by calling the same functions the site uses.",
  ],
];

const madeUp = [
  ["The clinic", "Poliambulatorio Vallenova does not exist. Address, phone numbers and emails are made up and reach nobody."],
  ["The doctors", "The fourteen specialists, their biographies and register numbers are made up. There are no photos because there are no people."],
  ["Prices and times", "Costs, durations and report times are plausible but made up: they are not the price list of any clinic."],
  ["The bookings", "An appointment confirmed here reaches no reception, generates no email and commits nobody. Nobody is waiting for you."],
];

const link = "text-enamel underline decoration-dotted underline-offset-4";

export function ComeFunzionaEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">How this demo works</h1>
      <p className="mt-4 text-lg leading-relaxed">
        This is a made-up outpatient clinic, built to show how an assistant works when it does not just chat but uses the
        site&apos;s data and tools. It is worth saying precisely what, in here, is real and what is not.
      </p>

      <section className="mt-12" aria-labelledby="vero">
        <h2 id="vero" className="font-display text-3xl">
          What is real
        </h2>
        <dl className="mt-5 divide-y border-y">
          {real.map(([t, d]) => (
            <div key={t} className="py-4">
              <dt className="font-semibold">{t}</dt>
              <dd className="text-muted-foreground mt-1 leading-relaxed">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12" aria-labelledby="finto">
        <h2 id="finto" className="font-display text-3xl">
          What is made up
        </h2>
        <dl className="mt-5 divide-y border-y">
          {madeUp.map(([t, d]) => (
            <div key={t} className="py-4">
              <dt className="font-semibold">{t}</dt>
              <dd className="text-muted-foreground mt-1 leading-relaxed">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12" aria-labelledby="limiti">
        <h2 id="limiti" className="font-display text-3xl">
          What the assistant does not do
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            <strong>It gives no medical advice</strong> and does not say which visit or test is needed in a particular case:
            that is a clinical decision and a doctor makes it.
          </li>
          <li>
            <strong>It makes no diagnoses</strong> and does not interpret reports, values or symptoms, not even tentatively.
          </li>
          <li>
            <strong>It does not handle emergencies.</strong> Faced with an urgent problem there is only one answer: call{" "}
            <strong>112</strong> or go to the emergency department.
          </li>
          <li>It deals with organisation: what can be booked, how much it costs, how long it takes, how to get here, when the report is ready, how to cancel.</li>
        </ul>
        <div className="mt-6 flex gap-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5">
          <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
          <p className="text-sm leading-relaxed">
            This is not an emergency department and it does not replace your GP. In an emergency call <strong>112</strong>.
          </p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="modello">
        <h2 id="modello" className="font-display text-3xl">
          Which model it uses
        </h2>
        <p className="mt-4 leading-relaxed">
          The answers come from free language models on{" "}
          <a href="https://openrouter.ai" className={link} rel="noreferrer noopener" target="_blank">
            OpenRouter
          </a>
          : first <code>nvidia/nemotron-3-ultra-550b-a55b:free</code>, and when it is busy a backup model and then the free router.
          They are free and have a daily request cap: if the demo is very busy the assistant may slow down or refuse to answer,
          and the model actually used may change.
        </p>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          A language model <strong>can be wrong</strong>: it can misunderstand a request or summarise imperfectly. That is why it
          takes the important information (availability, prices, rooms) from the site&apos;s tools instead of making it up, and why
          every page can be used without the assistant: everything can be booked by yourself, with links alone.
        </p>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          The clinic&apos;s data is written in Italian. The English pages show a translation, and the assistant answers in the
          language you write in, translating what its tools return.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="privacy">
        <h2 id="privacy" className="font-display text-3xl">
          Privacy
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            The site&apos;s data is <strong>made up</strong>: no real patient, no medical record, no real report.
          </li>
          <li>Do not write real data in the booking form. A tick box asks you to confirm you have understood this.</li>
          <li>
            <strong>Conversations</strong> with the assistant are kept for <strong>30 days</strong>, to understand what people ask
            and fix wrong answers, then they are deleted.
          </li>
          <li>
            <strong>Visitors&apos; bookings</strong> are deleted after <strong>7 days</strong>, so the demo&apos;s diary stays clean.
          </li>
          <li>
            No IP address is stored in plain text: for the traffic limits only a <strong>hash</strong> is kept, from which the
            address cannot be rebuilt.
          </li>
          <li>
            The full picture, including where the questions go, is on the{" "}
            <Link href="/en/privacy" className={link}>
              Privacy
            </Link>{" "}
            page.
          </li>
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="altro">
        <h2 id="altro" className="font-display text-3xl">
          Find out more
        </h2>
        <ul className="mt-5 space-y-2 leading-relaxed">
          <li>
            <Link href="/en/informazioni" className={link}>
              The clinic&apos;s information pages
            </Link>{" "}
            — hours, payments, documents, accessibility, privacy in demo form.
          </li>
          <li>
            <Link href="/en/crediti" className={link}>
              Credits and licences
            </Link>{" "}
            — who made it, with which tools, and how to reuse texts and code.
          </li>
          <li>
            <a href="https://chat-bot.giuseppebosi.com/en/tutorial" className={link} rel="noreferrer noopener" target="_blank">
              How it was built
            </a>{" "}
            — the tutorial on the twin site, a coffee shop with the same assistant, where the code is explained step by step.
          </li>
        </ul>
      </section>
    </div>
  );
}
