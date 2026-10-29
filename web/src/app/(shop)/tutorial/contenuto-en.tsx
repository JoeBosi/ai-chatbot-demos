import Link from "next/link";

import { Indice, Nota, Prova, Sezione } from "@/components/tutorial/blocks";
import { CodeBlock } from "@/components/tutorial/code-block";

import {
  snippetApiWidget,
  snippetCaddy,
  snippetChiave,
  snippetChiaveHtml,
  snippetCompose,
  snippetComposeProd,
  snippetCookie,
  snippetCurl,
  snippetDockerfile,
  snippetEmbedPage,
  snippetEmbeddings,
  snippetEsegui,
  snippetIncolla,
  snippetIntestazioni,
  snippetIstruzioni,
  snippetLimiti,
  snippetParti,
  snippetProgetto,
  snippetProvaLocale,
  snippetProvider,
  snippetRicerca,
  snippetRoute,
  snippetSchema,
  snippetTestChat,
  snippetTestWidget,
  snippetTools,
  snippetUseChat,
  snippetWidget,
} from "./snippets";

// English version of the tutorial. Only the prose is translated: the code, the commands and the
// file names are the same snippets as the Italian page, comments included.

const contents = [
  { id: "provalo", titolo: "1 · Try it on your site in 5 minutes", livello: "beginner" },
  { id: "come-funziona", titolo: "2 · What happens when you ask a question", livello: "beginner" },
  { id: "progetto", titolo: "3 · The project and the database", livello: "intermediate" },
  { id: "ricerca", titolo: "4 · Finding the right products", livello: "intermediate" },
  { id: "attrezzi", titolo: "5 · Tools: letting the model act", livello: "intermediate" },
  { id: "endpoint", titolo: "6 · The chat endpoint", livello: "intermediate" },
  { id: "interfaccia", titolo: "7 · An interface that shows products, not JSON", livello: "intermediate" },
  { id: "widget", titolo: "8 · The widget: getting into any website", livello: "advanced" },
  { id: "prove", titolo: "9 · Testing it for real (curl and Playwright)", livello: "advanced" },
  { id: "online", titolo: "10 · Putting it online", livello: "advanced" },
  { id: "sicurezza", titolo: "11 · Security, limits and costs", livello: "advanced" },
  { id: "esercizi", titolo: "12 · Exercises, from here on", livello: "expert" },
  { id: "dopo", titolo: "13 · And then? Maintaining it", livello: "expert" },
];

const link = "hover:text-enamel underline decoration-dotted underline-offset-4";

export function TutorialEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header>
        <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">Tutorial</p>
        <h1 className="font-display mt-2 text-4xl leading-[1.05] md:text-5xl">An assistant that helps people buy, on your website</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          This page starts from one line you paste into your site and ends with the complete code of the assistant you see here:
          catalogue search, cart, order status, support requests. All the code is commented and every chapter ends with something
          to try, so you really understand what is going on.
        </p>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          by Prof. Giuseppe Bosi. The code, its comments and the shop data are in Italian, as on the original site; the explanations
          are in English.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["What you need to know", "A little HTML for chapter 1. For the rest, basic JavaScript or TypeScript."],
            ["What you need to have", "A computer with Node 24 and Docker. No credit card: the model used is free."],
            ["Time", "5 minutes for the first chapter, half a day to rebuild everything calmly."],
          ].map(([t, d]) => (
            <div key={t} className="bg-card rounded-lg border p-3">
              <dt className="text-xs font-semibold tracking-wide uppercase">{t}</dt>
              <dd className="text-muted-foreground mt-1 text-sm leading-snug">{d}</dd>
            </div>
          ))}
        </dl>
      </header>

      <Indice voci={contents} lang="en" />

      <div className="mt-12 flex flex-col gap-12">
        <Sezione id="provalo" occhiello="Beginner" titolo="1 · Try it on your site in 5 minutes">
          <p>
            This shop&apos;s assistant can be pasted into any web page: a blog, a hand-made site, WordPress, Shopify. It takes a
            single line, just before the closing <code>&lt;/body&gt;</code>.
          </p>
          <CodeBlock file="your site · index.html" code={snippetIncolla} />
          <p>
            There is no sign-up: the script works out by itself which address it was loaded from and talks to it, and the API key
            is added by the page served from our server. There are three options, all optional:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3 font-semibold">Attribute</th>
                  <th className="py-2 pr-3 font-semibold">What it does</th>
                  <th className="py-2 font-semibold">Default value</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {[
                  ["data-etichetta", "The text written on the bubble", "Chiedi al Barista"],
                  ["data-colore", "Colour of the bubble (any CSS colour)", "#123a2f"],
                  ["data-posizione", "«destra» (right) or «sinistra» (left) at the bottom of the page", "destra"],
                ].map(([a, b, c]) => (
                  <tr key={a} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs">{a}</td>
                    <td className="py-2 pr-3">{b}</td>
                    <td className="py-2 font-mono text-xs">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Prova titolo="put it in an empty page" lang="en">
            <p>
              Opening the file with a double click is not enough: the browser refuses to frame the chat inside a{" "}
              <code>file://</code> address. You need a real address, even just on your own computer.
            </p>
            <CodeBlock code={snippetProvaLocale} />
            <p>
              It works if the bubble appears, clicking it opens the panel, and writing «Quanto costa la spedizione?» (how much is
              shipping?) brings an answer with the 49 € rule. If the bubble does not appear, open the browser console: it is almost
              always a wrong address in the <code>src</code>.
            </p>
          </Prova>
          <p>If you would rather open the chat from your own button, there is a small API:</p>
          <CodeBlock file="your site · index.html" code={snippetApiWidget} />
          <Nota>
            If instead you want to call the APIs by hand (with <code>curl</code>, or from a script of yours), you need a header:{" "}
            <code>x-cf-key: cfdemo_pub_2026</code>. It is a <strong>public</strong> key: it is written here, it reaches the browser
            of anyone who opens the site, and it protects nothing secret. It only keeps passing bots out and can be changed in a
            minute if someone abuses it. The real secret, the model key, stays on the server.
          </Nota>
          <Nota>
            This widget answers from the catalogue of this demo shop: it is there to show how it behaves, not to sell your products.
            For your shop you supply the catalogue: that is the rest of the tutorial.
          </Nota>
        </Sezione>

        <Sezione id="come-funziona" occhiello="Beginner" titolo="2 · What happens when you ask a question">
          <p>
            A useful chatbot does not «know» your catalogue: you give it <strong>tools</strong>, that is, functions of your site
            that it can call. The model decides which one to call, your code runs it, and the result goes back to the model, which
            writes the answer. That way the prices are the real ones and the cart is the real one.
          </p>
          <ol className="flex flex-col gap-3">
            {[
              [
                "You write «a machine under 400 euros»",
                "The browser sends the message to your server, not to the model provider: the key stays at home.",
              ],
              [
                "The server adds the instructions and the list of tools",
                "The instructions are the Barista's character and rules: what it can do and what it must never do.",
              ],
              [
                "The model replies «I want searchProducts with query: espresso machine, maxPrice: 400»",
                "It has not searched anything: it has only asked for a search.",
              ],
              ["Your code runs the search on the database", "This is where the serious part happens: Italian words plus meaning (chapter 4)."],
              [
                "The results go back to the model, which writes the answer",
                "And the interface, instead of JSON, draws the real product cards.",
              ],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="bg-enamel flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span>
                  <strong>{t}.</strong> <span className="text-muted-foreground">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p>
            The text arrives in pieces while the model writes it (<em>streaming</em>): that is what makes the chat feel alive
            instead of making you stare at a dot for ten seconds.
          </p>
          <Prova titolo="watch the pieces arrive" lang="en">
            <p>This is the same call the browser makes, seen from the terminal:</p>
            <CodeBlock code={snippetCurl} />
          </Prova>
        </Sezione>

        <Sezione id="progetto" occhiello="Intermediate" titolo="3 · The project and the database">
          <p>
            The project is a single Next.js application: the shop pages, the chat endpoint and the widget page live together, so
            the browser always talks to the same origin and no CORS permissions are needed.
          </p>
          <CodeBlock code={snippetProgetto} />
          <p>
            The database is PostgreSQL with <strong>pgvector</strong>, the extension that can compare meanings. A single container,
            never exposed to the internet:
          </p>
          <CodeBlock file="docker-compose.yml" code={snippetCompose} />
          <p>
            In the products table, besides the usual fields, there are two special ones: one with the <strong>words</strong> and one
            with the <strong>meaning</strong>.
          </p>
          <CodeBlock file="src/lib/db/schema.ts" code={snippetSchema} />
          <p>
            The «meaning» is 384 numbers that describe the text. They are computed in-house, with a small model that runs on the
            CPU: no API, no cost, no data leaving the server.
          </p>
          <CodeBlock file="src/lib/embeddings.ts" code={snippetEmbeddings} />
        </Sezione>

        <Sezione id="ricerca" occhiello="Intermediate" titolo="4 · Finding the right products">
          <p>
            Search by words alone does not understand «something for cappuccino»; search by meaning alone gets proper names and
            codes wrong. You do both and merge the rankings: that is <strong>hybrid search</strong>, and the merging method is
            called Reciprocal Rank Fusion.
          </p>
          <CodeBlock file="src/lib/catalog.ts" code={snippetRicerca} />
          <p>
            The very same technique works for the help pages (shipping, returns, warranty): you split the documents into sections,
            store them with their meaning, and the assistant cites the right section. This is what is usually called RAG, and in
            practice it is exactly this: a well-made search before answering.
          </p>
        </Sezione>

        <Sezione id="attrezzi" occhiello="Intermediate" titolo="5 · Tools: letting the model act">
          <p>
            Each tool is a function with three things: a <strong>description</strong> that tells the model when to use it, a zod{" "}
            <strong>schema</strong> that validates what the model passes in, and the code that does the work. The schema is not
            red tape: it is the line beyond which the model no longer decides anything.
          </p>
          <CodeBlock file="src/lib/ai/tools.ts" code={snippetTools} />
          <p>
            Rule of thumb: tools that <em>read</em> can run on their own; those that <strong>write</strong> (opening a ticket,
            placing an order, sending an email) ask for a click. The AI SDK has approval built in and signs it, so nobody can fake a
            permission from the browser.
          </p>
          <p>Finally, the instructions are the assistant&apos;s character and boundaries:</p>
          <CodeBlock file="src/lib/ai/instructions.ts" code={snippetIstruzioni} />
        </Sezione>

        <Sezione id="endpoint" occhiello="Intermediate" titolo="6 · The chat endpoint">
          <p>
            All the parts meet here: checking what comes in, limits, instructions, tools, streaming the answer. It is about forty
            lines.
          </p>
          <CodeBlock file="src/app/api/chat/route.ts" code={snippetRoute} />
          <p>
            Three points that look like details and are not. <strong>The history comes from the browser</strong>: anyone can
            rewrite it, so it is cleaned and its characters are counted. <strong>The quota is always consumed</strong>, even when
            the conversation resumes after an approval, otherwise the limit can be bypassed.{" "}
            <strong>The number of rounds is capped</strong> (<code>isStepCount(6)</code>): without it, a confused model calls tools
            forever.
          </p>
          <p>The model is chosen in one place only, and changed with an environment variable:</p>
          <CodeBlock file="src/lib/ai/provider.ts" code={snippetProvider} />
        </Sezione>

        <Sezione id="interfaccia" occhiello="Intermediate" titolo="7 · An interface that shows products, not JSON">
          <p>
            In the browser the work is done by <code>useChat</code>: it keeps the messages, sends them, receives the streamed
            pieces and redraws.
          </p>
          <CodeBlock file="src/components/assistant/assistant-provider.tsx" code={snippetUseChat} />
          <p>
            The difference between any chatbot and a shopping assistant is all here: every tool call has its own face. The reader
            sees a product card with a picture and a price, a comparison table, the order timeline, not a block of JSON.
          </p>
          <CodeBlock file="src/components/assistant/assistant-panel.tsx" code={snippetParti} />
        </Sezione>

        <Sezione id="widget" occhiello="Advanced" titolo="8 · The widget: getting into any website">
          <p>
            The widget has two pieces: an <code>/embed</code> page containing only the chat, and a <code>widget.js</code> file that
            draws the bubble on the host site and, on the first click, opens an iframe on that page.
          </p>
          <p>
            Why an iframe and not the component directly in the page? Because the host site is not your home: its CSS would
            distort the chat, its JavaScript could read it, and an old library could break yours. Inside the iframe the chat is
            truly isolated.
          </p>
          <CodeBlock file="src/app/embed/page.tsx" code={snippetEmbedPage} />
          <CodeBlock file="public/widget.js" code={snippetWidget} />
          <p>Three traps you only discover by testing on a site other than yours (already solved here):</p>
          <ul className="ml-5 flex list-disc flex-col gap-2 marker:text-steel">
            <li>
              <strong>Who may frame you.</strong> The <code>frame-ancestors</code> header decides which sites can put you in an
              iframe. It must apply to <code>/embed</code> differently from the rest of the site.
            </li>
            <li>
              <strong>Third-party cookies.</strong> Inside the iframe the cart cookie is «third-party»: without
              <code> SameSite=None</code> and <code>Partitioned</code> the browser throws it away and the cart empties at every
              message. And it must use a <strong>different name</strong> from the shop&apos;s cookie: otherwise, on a browser that
              ignores <code>Partitioned</code>, visitors of two different sites would end up in the same cart.
            </li>
            <li>
              <strong>Messages between the two pages.</strong> When the customer closes the chat, the iframe must ask the host site
              to close the panel. Always check the origin of the sender, otherwise any page can control the widget.
            </li>
          </ul>
          <CodeBlock file="next.config.ts" code={snippetIntestazioni} />
          <CodeBlock file="src/lib/cart.ts" code={snippetCookie} />
        </Sezione>

        <Sezione id="prove" occhiello="Advanced" titolo="9 · Testing it for real (curl and Playwright)">
          <p>
            With a model you cannot check the words: today it says «sure, here are three machines», tomorrow «happy to help!». So
            you check the <strong>facts</strong>: did it call the right tool? did the cart change? does the support request leave
            only after the click?
          </p>
          <CodeBlock file="tests/e2e/assistant.spec.ts" code={snippetTestChat} />
          <p>
            The widget must be tested <strong>from another origin</strong>: testing it on the site itself proves nothing, because
            the real problems (blocked iframe, discarded cookies, clashing styles) only show up from outside.
          </p>
          <CodeBlock file="tests/e2e/widget.spec.ts" code={snippetTestWidget} />
          <Prova titolo="the checklist before handing over" lang="en">
            <CodeBlock code={snippetEsegui} />
            <p>
              If a test fails because the free model got it wrong (it happens: sometimes it writes the tool call as text instead of
              running it), do not change the test to make it pass: allow a second attempt and write it down in the notes. A test
              that adapts to the model no longer proves anything.
            </p>
          </Prova>
        </Sezione>

        <Sezione id="online" occhiello="Advanced" titolo="10 · Putting it online">
          <p>
            The image is built in three stages, so the final one contains only what is needed to answer. The embedding model is
            downloaded during the build: in production the application downloads nothing from the internet.
          </p>
          <CodeBlock file="Dockerfile" code={snippetDockerfile} />
          <CodeBlock file="docker-compose.yml" code={snippetComposeProd} />
          <p>
            In front there is a reverse proxy (here Caddy, which handles HTTPS certificates by itself). Two lines make the
            difference between a chat that flows and one that seems stuck:
          </p>
          <CodeBlock file="/etc/caddy/Caddyfile" code={snippetCaddy} />
          <p>
            The block also has an optional <strong>password on the site</strong> (<code>basic_auth</code>: this demo had one for a
            few weeks, now it is open). If you add it, mind the order of the paths: if the password also applies to{" "}
            <code>/widget.js</code>, <code>/embed</code> and the APIs, whoever installs the widget sees the login box pop up inside
            their own site. The hash is generated with <code>caddy hash-password</code>: the plain password never goes in the file.
          </p>
          <Nota>
            The first start runs the database migrations and loads the sample data by itself. An <code>/api/health</code> that
            queries the database tells the container whether it is really ready: without it, the proxy sends visitors to an
            application that is still starting.
          </Nota>
        </Sezione>

        <Sezione id="sicurezza" occhiello="Advanced" titolo="11 · Security, limits and costs">
          <p>An assistant that can act is a new attack surface. The defences that matter, in order of importance:</p>
          <ul className="ml-5 flex list-disc flex-col gap-2 marker:text-steel">
            <li>
              <strong>Tools do not trust the model.</strong> An order&apos;s status can only be read with the number <em>and</em>{" "}
              the email; the cart is the visitor&apos;s, tied to their cookie; the ticket leaves only after a click. Even if someone
              convinces the model to «do as I say», the tools do not let it.
            </li>
            <li>
              <strong>Third-party text is data, not a command.</strong> A product description or a review can contain «ignore the
              previous instructions». The model is told to ignore it, and no tools are built that execute what they read.
            </li>
            <li>
              <strong>Limits everywhere.</strong> Message length, request size, messages per minute and per day for each visitor,
              a daily cap for the whole site.
            </li>
            <li>
              <strong>No secrets in the browser.</strong> The model key lives only on the server. The database stores a
              fingerprint of the IP, not the address.
            </li>
            <li>
              <strong>A public key on the APIs.</strong> The <code>/api/chat</code> and <code>/api/cart</code> routes answer{" "}
              <code>401</code> without the <code>x-cf-key</code> header. It is not a real defence (the key is in everyone&apos;s
              browser), but it raises the bar for bots and lets you change it without touching anything else.
            </li>
          </ul>
          <CodeBlock file="src/lib/request.ts" code={snippetChiave} />
          <CodeBlock code={snippetChiaveHtml} />
          <CodeBlock file="src/lib/rate-limit.ts" code={snippetLimiti} />
          <p className="font-semibold">What it costs, in practice</p>
          <p>
            A complete message uses about 2,500 input tokens and 400 output tokens, because each turn makes two calls to the model
            (one to choose the tool, one to write the answer). At September 2026 prices:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3 font-semibold">Model</th>
                  <th className="py-2 pr-3 font-semibold">1,000 messages</th>
                  <th className="py-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {[
                  ["openrouter/free", "0 €", "free models, as used here: variable quality, daily limits"],
                  ["mistral-small-3.2-24b", "~$0.34", "good balance, consistent answers"],
                  ["glm-5.3-flash", "~$0.35", "fast, very reliable with tools"],
                  ["gpt-oss-120b", "~$0.62", "the best of the three at long answers"],
                ].map(([m, c, n]) => (
                  <tr key={m} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs">{m}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{c}</td>
                    <td className="text-muted-foreground py-2">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Embeddings cost nothing because they run on your server. Renting a GPU to run a model of your own makes sense for data
            confidentiality, not for price: break-even with the API comes at around half a million messages a month.
          </p>
        </Sezione>

        <Sezione id="esercizi" occhiello="Expert" titolo="12 · Exercises, from here on">
          <ol className="flex flex-col gap-3">
            {[
              [
                "Change the catalogue",
                "Replace the sample products with yours (a name, a price and two lines of description are enough) and regenerate the embeddings. This is the step that turns the demo into your shop.",
              ],
              [
                "Add a tool that reads",
                "For example «in-store availability»: zod schema, clear description, short result. Then watch how often the model uses it on its own.",
              ],
              [
                "Add a tool that writes",
                "A booking, a quote. Force it through approval and write the test that proves nothing happens without a click.",
              ],
              [
                "Connect your real e-commerce",
                "The tools become calls to the APIs of Shopify, WooCommerce or your management system. The rest of the setup does not change.",
              ],
              [
                "Measure the quality",
                "Write twenty typical questions with the expected answer (which tool, which product) and run them at every model change: it is how you notice a regression before your customers do.",
              ],
              [
                "Open the widget only to your clients",
                "Put a list of authorised sites in frame-ancestors, one per client, and an identifier in the snippet so you know who is asking.",
              ],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="border-enamel text-enamel flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
                  {i + 1}
                </span>
                <span>
                  <strong>{t}.</strong> <span className="text-muted-foreground">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </Sezione>
        <Sezione id="dopo" occhiello="Expert" titolo="13 · And then? Maintaining it">
          <p>
            Building it is the short part. The long part is keeping it up to date when prices, rules and customer questions change,
            and knowing what to do when the chat stops answering at three in the morning. These are two different jobs with two
            pages:{" "}
            <Link href="/en/manutenzione" className={link}>
              Maintenance
            </Link>{" "}
            (content, tone, fixes) and{" "}
            <Link href="/en/operatore" className={link}>
              Operator&apos;s manual
            </Link>{" "}
            (deploy, backups, keys, failures).
          </p>
        </Sezione>
      </div>

      <footer className="mt-12 border-t pt-8">
        <p className="text-muted-foreground text-sm">
          The technical choices behind this project, and the alternatives that were dropped, are described in{" "}
          <Link href="/en/come-funziona" className="text-foreground underline decoration-dotted underline-offset-4">
            How this demo works
          </Link>
          . To see the assistant at work, open the Barista at the bottom right and ask it for a machine for cappuccino.
        </p>
      </footer>
    </div>
  );
}
