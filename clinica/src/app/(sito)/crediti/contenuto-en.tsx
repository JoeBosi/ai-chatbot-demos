import Link from "next/link";

// English version of the credits page. Tool names and links are the same as on the Italian page.
const tools: [string, string, string][] = [
  ["Next.js and React", "the site, the pages and the booking form", "https://nextjs.org/docs"],
  ["Vercel AI SDK", "chat streaming and the tools the assistant can call", "https://ai-sdk.dev/docs"],
  ["PostgreSQL with pgvector", "the database: services, shifts, bookings and the index for search by meaning", "https://github.com/pgvector/pgvector"],
  ["Drizzle ORM", "the database tables and migrations", "https://orm.drizzle.team/docs"],
  ["Transformers.js (multilingual-e5-small model)", "embeddings computed on the server, with no external services", "https://huggingface.co/docs/transformers.js"],
  ["OpenRouter", "the language model that writes the answers, through free models", "https://openrouter.ai/docs"],
  ["Tailwind CSS, shadcn/ui and AI Elements", "the look of the pages and of the chat", "https://ui.shadcn.com/docs"],
  ["Lucide", "the icons", "https://lucide.dev"],
  ["Bodoni Moda and Hanken Grotesk", "the fonts, built into the site at compile time: the browser contacts no third-party services", "https://fonts.google.com/knowledge"],
  ["Playwright", "the automated tests: booking, cancellation, widget, assistant limits", "https://playwright.dev/docs/intro"],
  ["Docker and Caddy", "deployment: two containers on a server in Europe, automatic HTTPS", "https://caddyserver.com/docs"],
];

const link = "text-enamel underline decoration-dotted underline-offset-4";

export function CreditiEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Credits and licences</h1>
      <p className="mt-4 text-lg leading-relaxed">
        This site is a teaching project by <strong>Prof. Giuseppe Bosi</strong>, Master&apos;s-level degree in Electronic
        Engineering (5-year Italian Laurea, pre-reform, EQF level 7) and Teacher of Computer Science and Technology. It shows,
        with an example you can try, how a chat assistant works inside a website: it searches the documents, works out
        availability, books only after the person confirms, and refuses to do what is not its job.
      </p>

      <section className="mt-12" aria-labelledby="licenze">
        <h2 id="licenze" className="font-display text-3xl">
          How they can be reused
        </h2>
        <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed">
          <li>
            <strong>Texts and content</strong> of these pages (specialties, services, information pages, explanations):{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" className={link} rel="noreferrer noopener" target="_blank">
              Creative Commons Attribution 4.0 (CC BY 4.0)
            </a>{" "}
            licence. They can be copied, adapted and reused, commercially too, crediting «Giuseppe Bosi».
          </li>
          <li>
            <strong>Code</strong> of the site, the assistant and the widget:{" "}
            <a href="https://opensource.org/license/mit" className={link} rel="noreferrer noopener" target="_blank">
              MIT
            </a>{" "}
            licence. It can be used, modified and redistributed, keeping the copyright notice.
          </li>
          <li>
            The names of the clinic and the doctors and the prices are <strong>made up</strong> for the example: any resemblance
            to real clinics or people is coincidental.
          </li>
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="strumenti">
        <h2 id="strumenti" className="font-display text-3xl">
          What it is made with
        </h2>
        <p className="mt-4 leading-relaxed">All the software used is free or open source. For each piece, the link goes to the official documentation.</p>
        <dl className="mt-5 divide-y border-y">
          {tools.map(([name, what, url]) => (
            <div key={name} className="py-3">
              <dt className="font-semibold">
                <a href={url} className={link} rel="noreferrer noopener" target="_blank">
                  {name}
                </a>
              </dt>
              <dd className="text-muted-foreground mt-0.5 leading-relaxed">{what}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12" aria-labelledby="altro">
        <h2 id="altro" className="font-display text-3xl">
          Further reading
        </h2>
        <ul className="mt-5 space-y-2 leading-relaxed">
          <li>
            <Link href="/en/come-funziona" className={link}>
              How this demo works
            </Link>{" "}
            — what is real, what is made up, what the assistant does not do.
          </li>
          <li>
            <Link href="/en/privacy" className={link}>
              Privacy
            </Link>{" "}
            — what data passes through here, where it goes and how long it stays.
          </li>
          <li>
            <a href="https://chat-bot.giuseppebosi.com/en/tutorial" className={link} rel="noreferrer noopener" target="_blank">
              The tutorial
            </a>{" "}
            — the code explained step by step on the twin site, and how to put the same assistant on another site.
          </li>
          <li>
            <a href="https://www.giuseppebosi.com/en/" className={link} rel="noreferrer noopener" target="_blank">
              www.giuseppebosi.com
            </a>{" "}
            — the author&apos;s website.
          </li>
        </ul>
      </section>
    </div>
  );
}
