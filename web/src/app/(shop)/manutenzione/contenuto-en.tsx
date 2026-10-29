import Link from "next/link";

import { Attenzione, Indice, Nota, Prova, Sezione, Tabella } from "@/components/tutorial/blocks";
import { CodeBlock } from "@/components/tutorial/code-block";

import {
  snippetChats,
  snippetDiagnosi,
  snippetFonti,
  snippetGiro,
  snippetProdotto,
  snippetProve,
  snippetRimuovi,
  snippetRoutine,
  snippetSezione,
  snippetTono,
  snippetVocabolario,
} from "./snippets";

// English version of the maintenance guide. Prose only: snippets, commands and file names are the
// same as on the Italian page. The assistant's texts it talks about are in Italian on purpose.

const contents = [
  { id: "fonti", titolo: "1 · Where an answer comes from", livello: "basic" },
  { id: "giro", titolo: "2 · The journey of a change, start to finish", livello: "basic" },
  { id: "sbagliata", titolo: "3 · It answered badly: where to step in", livello: "basic" },
  { id: "ampliare", titolo: "4 · Extending: teaching it something new", livello: "basic" },
  { id: "ridurre", titolo: "5 · Reducing: removing or correcting information", livello: "basic" },
  { id: "vocabolario", titolo: "6 · Being found with the customers' words", livello: "intermediate" },
  { id: "tono", titolo: "7 · Tone, length and style of the answers", livello: "intermediate" },
  { id: "prodotti", titolo: "8 · Prices, stock and new products", livello: "intermediate" },
  { id: "limiti", titolo: "9 · What instructions cannot fix", livello: "intermediate" },
  { id: "provare", titolo: "10 · Testing before publishing", livello: "intermediate" },
  { id: "ascoltare", titolo: "11 · Reading what customers ask", livello: "intermediate" },
  { id: "routine", titolo: "12 · The routine, and the most expensive mistakes", livello: "basic" },
];

const link = "hover:text-enamel underline decoration-dotted underline-offset-4";

export function ManutenzioneEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header>
        <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">Maintenance</p>
        <h1 className="font-display mt-2 text-4xl leading-[1.05] md:text-5xl">Keeping the assistant sharp, week after week</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          A chatbot is never «finished»: a price changes, a question comes in that it cannot answer, the tone is not quite right.
          This page is for whoever looks after the assistant. You do not need to program: you need a text editor and three
          commands. The real work is deciding <em>what</em> it must know and <em>how</em> it must speak.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["What you need to know", "How to write clear Italian (the shop's language). No code: you edit texts in two files."],
            ["What you need to have", "Access to the project files and permission to run ./deploy.sh."],
            ["Time", "One change: 10 minutes. The weekly routine: 20 minutes."],
          ].map(([t, d]) => (
            <div key={t} className="bg-card rounded-lg border p-3">
              <dt className="text-xs font-semibold tracking-wide uppercase">{t}</dt>
              <dd className="text-muted-foreground mt-1 text-sm leading-snug">{d}</dd>
            </div>
          ))}
        </dl>
        <p className="text-muted-foreground mt-4 text-sm">
          If instead you have to keep the <em>service</em> running (deploy, logs, backups, keys, failures), the page is the{" "}
          <Link href="/en/operatore" className={link}>
            Operator&apos;s manual
          </Link>
          . To understand how everything is built:{" "}
          <Link href="/en/tutorial" className={link}>
            the tutorial
          </Link>
          .
        </p>
      </header>

      <Indice voci={contents} lang="en" />

      <div className="mt-12 flex flex-col gap-12">
        <Sezione id="fonti" occhiello="Basic" titolo="1 · Where an answer comes from">
          <p>
            The AI model knows nothing about your shop: it does not know the prices, has not read the return policy, does not know
            you exist. Everything concrete it says comes from text files that you can edit. Knowing which file to look at is half
            of the maintenance work.
          </p>
          <CodeBlock code={snippetFonti} />
          <Tabella
            intestazioni={["If the assistant…", "Fix it in", "How long it takes"]}
            righe={[
              ["gives a wrong price or stock level", <code key="a">src/data/catalog.ts</code>, "2 minutes"],
              ["gets shipping, returns, warranty or hours wrong", <code key="b">src/data/help.ts</code>, "5 minutes"],
              ["cannot answer a frequent question", <code key="c">src/data/help.ts</code>, "10 minutes"],
              ["is too wordy, pushy or formal", <code key="d">src/lib/ai/instructions.ts</code>, "2 minutes"],
              [
                "cannot find a product that exists",
                <span key="e">
                  tags and description in <code>src/data/catalog.ts</code>
                </span>,
                "5 minutes",
              ],
              ["should be able to do something it cannot", <code key="f">src/lib/ai/tools.ts</code>, "needs a developer"],
            ]}
          />
          <Nota>
            The help-centre texts are the same ones customers read on <Link href="/en/assistenza">/assistenza</Link>: they are
            written once and serve both people and the assistant. That is deliberate: two copies of the same rule always end up
            contradicting each other. (On the English site customers read a translation; the assistant searches the Italian
            originals.)
          </Nota>
        </Sezione>

        <Sezione id="giro" occhiello="Basic" titolo="2 · The journey of a change, start to finish">
          <p>
            Editing the text is not enough: the content also lives in the database, where the assistant searches it. The hand-over
            is automatic, but it only happens when you publish.
          </p>
          <CodeBlock code={snippetGiro} />
          <p>
            <code>npm run content:check</code> is a preview: it tells you what would change (<code>+</code> added,{" "}
            <code>~</code> modified, <code>-</code> removed) without touching anything. <code>./deploy.sh</code> rebuilds the site
            and, at start-up, brings catalogue and help centre in line by itself. Only the changed texts are recomputed: fixing a
            price recomputes nothing, rewriting a description recomputes that product and nothing else.
          </p>
          <Prova titolo="change a comma and watch what happens" lang="en">
            <p>
              Open <code>src/data/help.ts</code>, add a sentence in the «Costi di spedizione» (shipping costs) section, for example
              «Le consegne il sabato hanno un supplemento di 3 €» (Saturday deliveries cost 3 € extra), then run{" "}
              <code>npm run content:check</code>: a line <code>~ spedizioni · Costi di spedizione</code> must appear. Publish with{" "}
              <code>./deploy.sh</code> and ask the assistant «can I get a delivery on Saturday?».
            </p>
          </Prova>
          <Attenzione lang="en">
            Until recently the content reached the database <em>only</em> at the first start: whoever edited a text and published
            again saw nothing change and thought the chatbot «wasn&apos;t listening». Now the sync is there, but only for the files
            in <code>src/data/</code>: what you write elsewhere does not reach the assistant.
          </Attenzione>
        </Sezione>

        <Sezione id="sbagliata" occhiello="Basic" titolo="3 · It answered badly: where to step in">
          <p>
            The temptation is always the same: open the instructions and add a line «stop saying shipping costs 9 euros». It is
            almost always the wrong cure: instructions are for <strong>behaviour</strong>, not for <strong>data</strong>. Before
            touching them, ask three questions.
          </p>
          <CodeBlock code={snippetDiagnosi} />
          <Tabella
            intestazioni={["Symptom", "Almost always caused by", "What to do"]}
            righe={[
              ["It invents a price", "it did not use the tools", "make the rule «ALWAYS use searchProducts» explicit; if it happens again, change model"],
              ["It quotes an old rule", "the help-centre text is out of date", "fix the section and publish"],
              ["It says «I don't know» about things you know", "the section is missing, or uses different words", "add the section (ch. 4) or the words (ch. 6)"],
              ["It answers with walls of text", "instructions too vague", "«at most 3 sentences» works better than «be concise»"],
              ["It always recommends the most expensive", "unbalanced descriptions", "write who each product is for, the cheap ones too"],
              ["Sometimes it gets it wrong, sometimes not", "it is the free model", "try twice before changing the texts"],
            ]}
          />
        </Sezione>

        <Sezione id="ampliare" occhiello="Basic" titolo="4 · Extending: teaching it something new">
          <p>
            Extending the knowledge base means adding a section to the help centre. Every heading that starts with <code>##</code>{" "}
            becomes a searchable piece of its own: it is the unit the assistant finds and cites.
          </p>
          <CodeBlock file="src/data/help.ts" code={snippetSezione} />
          <p>
            The difference between an assistant that helps and one that goes round in circles lies almost entirely in how these
            sections are written. A long section covering five topics is found for all five and cited badly; the same information
            split into five short sections is found precisely.
          </p>
          <Nota>
            This also applies to information that is not on any page of the site: «courses are on Saturdays», «we call back within
            24 hours», «we don&apos;t ship to Switzerland». If a customer can ask it, it must be written down.
          </Nota>
        </Sezione>

        <Sezione id="ridurre" occhiello="Basic" titolo="5 · Reducing: removing or correcting information">
          <p>
            Reducing does not mean deleting. If you remove a section, the assistant does not answer «I don&apos;t know»: it picks
            the closest text it can find and answers with that, which means it is wrong with confidence.
          </p>
          <CodeBlock file="src/data/help.ts" code={snippetRimuovi} />
          <p>
            Delete only what truly no longer exists: a discontinued product, an expired promotion, a closed service. Everything else
            gets <strong>rewritten</strong>, so the assistant always has a correct answer to give. And when a product leaves the
            catalogue, it also leaves the answers at the next deploy: nothing else to do.
          </p>
        </Sezione>

        <Sezione id="vocabolario" occhiello="Intermediate" titolo="6 · Being found with the customers' words">
          <p>
            Search works in two ways at once: the <strong>exact words</strong> and the <strong>meaning</strong>. Meaning covers a
            lot («caffettiera» finds the moka), but it does not cover slang, local expressions, trade names and spelling mistakes.
            Those have to be taught.
          </p>
          <CodeBlock code={snippetVocabolario} />
          <p>
            The best place for synonyms is a help-centre section written for customers («Coffee words, explained»): it helps them,
            and at the same time teaches the assistant that «macinino» and «macinacaffè» are the same thing.
          </p>
        </Sezione>

        <Sezione id="tono" occhiello="Intermediate" titolo="7 · Tone, length and style of the answers">
          <p>
            The assistant&apos;s character lives in a single text, read at every message. That is where you decide whether it is
            informal or formal, how long it is, how many questions it asks, when it offers a human, and what it must never say.
          </p>
          <CodeBlock file="src/lib/ai/instructions.ts" code={snippetTono} />
          <Tabella
            intestazioni={["If you want it to…", "Write this", "Don't write"]}
            righe={[
              ["be shorter", "«At most 3 sentences per answer.»", "«Be concise.»"],
              ["not be pushy", "«Add to the cart only if the customer asks.»", "«Don't be too salesy.»"],
              ["admit it does not know", "«If you can't find it with the tools, say so and offer support.»", "«Don't make things up.» on its own"],
              ["ask one question at a time", "«At most one question per message.»", "«Ask targeted questions.»"],
              ["be formal", "«Use the formal lei, professional tone.»", "«Be formal.»"],
            ]}
          />
          <Attenzione lang="en">
            Every rule you add steals attention from the others. Beyond about twenty lines the model starts forgetting some, and
            the first symptom is that it «sometimes» ignores an old rule. When you add a line, ask yourself which one you can
            remove.
          </Attenzione>
        </Sezione>

        <Sezione id="prodotti" occhiello="Intermediate" titolo="8 · Prices, stock and new products">
          <p>
            The catalogue is a list of product sheets in a file. Prices in euros, stock as a number: the code does the conversion
            and the rest.
          </p>
          <CodeBlock file="src/data/catalog.ts" code={snippetProdotto} />
          <p>
            The <code>slug</code> never changes: it is the address of the product page and the reference used by cart and orders.
            If a product changes name, change the <code>name</code> and leave the slug alone. (The English names and descriptions
            live in <code>src/data/en/catalog.ts</code>, keyed by the same slug.)
          </p>
          <Nota>
            In this demo the stock is reset to the values in the file once a day, because test purchases must not empty the shop.
            In a real shop stock comes from the management system: that is where, sooner or later, you need a developer.
          </Nota>
        </Sezione>

        <Sezione id="limiti" occhiello="Intermediate" titolo="9 · What instructions cannot fix">
          <p>Three things cannot be fixed with words, and insisting only does harm: it makes the instructions longer and everything else worse.</p>
          <ul className="ml-5 flex list-disc flex-col gap-2 marker:text-steel">
            <li>
              <strong>What the assistant can do.</strong> Searching, comparing, adding to the cart, checking an order, opening a
              request: these are functions written in the code (<code>src/lib/ai/tools.ts</code>). Asking it in the instructions
              to «apply a discount» does not give it the power to do so.
            </li>
            <li>
              <strong>The data it does not have.</strong> If the management system is not connected, no instruction will tell it
              how many packs are really left.
            </li>
            <li>
              <strong>The quality of the model.</strong> A free model runs here: sometimes it gets a step wrong or writes a call as
              text. If the same question goes wrong several times, the problem is not your text, it is the model, and you change it
              (see the{" "}
              <Link href="/en/operatore#modello" className={link}>
                operator&apos;s page
              </Link>
              ).
            </li>
          </ul>
        </Sezione>

        <Sezione id="provare" occhiello="Intermediate" titolo="10 · Testing before publishing">
          <p>
            With a model there is no «I fixed it, so now it is right»: the same change can solve one question and break another.
            That is why you keep a fixed list of questions and go through it every time.
          </p>
          <CodeBlock code={snippetProve} />
          <p>
            Ask them in a <strong>new</strong> conversation (close and reopen the chat): the assistant remembers the context, and a
            right answer obtained after three helpful messages proves nothing.
          </p>
          <Prova titolo="the check you never skip" lang="en">
            <p>
              After every change to the help centre, ask the same thing with words different from the ones you wrote: if you wrote
              «confezione regalo» (gift box), ask «si può incartare?» (can you wrap it?). If it does not find it, the problem is the
              words: go back to chapter 6.
            </p>
          </Prova>
        </Sezione>

        <Sezione id="ascoltare" occhiello="Intermediate" titolo="11 · Reading what customers ask">
          <p>
            You do not invent the list of things to improve: customers write it for you. Conversations are kept for 30 days,
            without plain IP addresses, and can be read with one command.
          </p>
          <CodeBlock code={snippetChats} />
          <p>
            The two lines that matter: how many conversations end <em>without</em> the assistant using a tool (a sign it answered
            off the cuff) and how many end in a support request (a sign it did not know the answer). That is where next
            week&apos;s sections come from.
          </p>
          <Nota>
            This is data about people: you look at it to improve the service, not to profile anyone. In this demo it is also made
            up: whoever uses it knows not to write real data.
          </Nota>
        </Sezione>

        <Sezione id="routine" occhiello="Basic" titolo="12 · The routine, and the most expensive mistakes">
          <CodeBlock code={snippetRoutine} />
          <p className="font-semibold">The five mistakes you will see (or make)</p>
          <ol className="ml-5 flex list-decimal flex-col gap-2 marker:text-steel">
            <li>
              <strong>Fixing a data problem in the instructions.</strong> It works for one question and breaks the others. The
              numbers belong in <code>src/data/</code>.
            </li>
            <li>
              <strong>Adding a section without removing the old one.</strong> Two different rules on the same topic = random
              answers.
            </li>
            <li>
              <strong>Writing for the model instead of for customers.</strong> The texts are also shown on{" "}
              <Link href="/en/assistenza">/assistenza</Link>: if they are ugly to read, they are ugly for everyone.
            </li>
            <li>
              <strong>Testing only once.</strong> The model varies: two tries, in different conversations.
            </li>
            <li>
              <strong>Editing and not publishing.</strong> Until you run <code>./deploy.sh</code>, the real site answers as before.
            </li>
          </ol>
          <Nota>
            One last thing, the most important: the assistant speaks to your customers in your voice. It is worth rereading it now
            and then as if you were a customer: it is more useful than any extra rule in the instructions.
          </Nota>
        </Sezione>
      </div>

      <div className="bg-card mt-12 rounded-lg border p-5">
        <p className="font-display text-xl">The other two pages</p>
        <ul className="mt-2 flex flex-col gap-1.5 text-[15px]">
          <li>
            <Link href="/en/tutorial" className={link}>
              Tutorial
            </Link>{" "}
            — how the assistant is built and how to put it on your site.
          </li>
          <li>
            <Link href="/en/operatore" className={link}>
              Operator&apos;s manual
            </Link>{" "}
            — deploy, logs, backups, keys, limits, failures.
          </li>
        </ul>
      </div>
    </div>
  );
}
