import Link from "next/link";

import { Attenzione, Indice, Nota, Sezione, Tabella } from "@/components/tutorial/blocks";
import { CodeBlock } from "@/components/tutorial/code-block";

import {
  snippetBackup,
  snippetCaddy,
  snippetChecklist,
  snippetChiavi,
  snippetDeploy,
  snippetLimiti,
  snippetMappa,
  snippetModello,
  snippetOgniGiorno,
  snippetPrivacy,
  snippetPronto,
  snippetStrumenti,
} from "./snippets";

// English version of the operator's manual. Prose only: commands, snippets and paths are the same
// as on the Italian page.

const contents = [
  { id: "mappa", titolo: "1 · The map, in one minute", livello: "orientation" },
  { id: "ogni-giorno", titolo: "2 · The three daily checks", livello: "routine" },
  { id: "deploy", titolo: "3 · Deploying and rolling back", livello: "routine" },
  { id: "contenuti", titolo: "4 · Getting new content through", livello: "routine" },
  { id: "database", titolo: "5 · Backup, restore and what never to do", livello: "critical" },
  { id: "chiavi", titolo: "6 · Secrets and key rotation", livello: "critical" },
  { id: "modello", titolo: "7 · Changing the model or the provider", livello: "critical" },
  { id: "limiti", titolo: "8 · Limits, quotas and 429s", livello: "routine" },
  { id: "guasti", titolo: "9 · First aid: symptom, cause, command", livello: "emergency" },
  { id: "proxy", titolo: "10 · Caddy: HTTPS, password, other sites", livello: "critical" },
  { id: "privacy", titolo: "11 · Stored data and deletion", livello: "critical" },
  { id: "checklist", titolo: "12 · The two lists to always follow", livello: "routine" },
];

const link = "hover:text-enamel underline decoration-dotted underline-offset-4";

export function OperatoreEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header>
        <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">Operator</p>
        <h1 className="font-display mt-2 text-4xl leading-[1.05] md:text-5xl">Operator&apos;s manual</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          This page is for whoever keeps the service running: deploying a version, rolling back when it goes wrong, backing up
          and restoring the database, rotating keys, changing the model, understanding why the chat does not answer. Every command
          below is the one that really runs on this VPS.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["What you need to know", "Terminal, Docker and a little SQL. You don't need to know the application code."],
            ["What you need to have", "SSH access to the server and permissions on /etc/caddy."],
            ["Time", "Daily checks: 2 minutes. A full restore: 15 minutes."],
          ].map(([t, d]) => (
            <div key={t} className="bg-card rounded-lg border p-3">
              <dt className="text-xs font-semibold tracking-wide uppercase">{t}</dt>
              <dd className="text-muted-foreground mt-1 text-sm leading-snug">{d}</dd>
            </div>
          ))}
        </dl>
        <p className="text-muted-foreground mt-4 text-sm">
          For the assistant&apos;s content and behaviour (fixing answers, tone, new information) the page is{" "}
          <Link href="/en/manutenzione" className={link}>
            Maintenance
          </Link>
          . For how it is built:{" "}
          <Link href="/en/tutorial" className={link}>
            the tutorial
          </Link>
          .
        </p>
      </header>

      <Indice voci={contents} lang="en" />

      <div className="mt-12 flex flex-col gap-12">
        <Sezione id="mappa" occhiello="Orientation" titolo="1 · The map, in one minute">
          <p>
            Two containers and a proxy. Nothing else: no managed services, no queues, no external caches. The only piece outside is
            the model provider.
          </p>
          <CodeBlock code={snippetMappa} />
          <Tabella
            intestazioni={["Where", "What is there", "Who can reach it"]}
            righe={[
              [<code key="a">/etc/caddy/Caddyfile</code>, "proxy, HTTPS (and an optional password)", "root on the VPS"],
              [<code key="b">web/docker-compose.yml</code>, "the two containers and their limits", "root on the VPS"],
              [<code key="c">web/.env.production</code>, "the secrets (permissions 600)", "root only, never in the repository"],
              ["dbdata volume", "the whole database", "only the db container"],
              [<code key="e">127.0.0.1:3040</code>, "the application", "only the proxy, not the internet"],
            ]}
          />
        </Sezione>

        <Sezione id="ogni-giorno" occhiello="Routine" titolo="2 · The three daily checks">
          <p>Two minutes, and they cover 90% of the trouble before someone else reports it.</p>
          <CodeBlock code={snippetOgniGiorno} />
          <Nota>
            <code>/api/health</code> does not just say «the site is up»: it really queries the database. If it answers{" "}
            <code>503 db_unavailable</code>, the application is running but has lost the database: this is the situation in which
            the chat tells everyone «I can&apos;t answer».
          </Nota>
        </Sezione>

        <Sezione id="deploy" occhiello="Routine" titolo="3 · Deploying and rolling back">
          <p>
            The deploy rebuilds the image, restarts and waits for the site to respond before declaring itself done. If something
            goes wrong, one command takes you back: the previous image always stays on the server.
          </p>
          <CodeBlock code={snippetDeploy} />
          <Attenzione lang="en">
            The rollback brings back the code, <strong>not</strong> the database. If the problem is a migration that has already
            run, the rollback is not enough: you need to restore the backup (chapter 5). That is why the backup is taken{" "}
            <em>before</em> the deploy, not after.
          </Attenzione>
        </Sezione>

        <Sezione id="contenuti" occhiello="Routine" titolo="4 · Getting new content through">
          <p>
            Catalogue and help centre live in two text files and are poured into the database every time the application starts.
            Whoever looks after the content works on the files (see{" "}
            <Link href="/en/manutenzione" className={link}>
              Maintenance
            </Link>
            ); the operator needs to know how to see and force that step.
          </p>
          <CodeBlock code={snippetStrumenti} />
          <p>
            The <code>tools</code> profile is a throwaway container that mounts the project read-only and talks to the database
            over Docker&apos;s internal network: it is the only way to run commands on the database, which is not published to the
            internet. It does not stay on and does not touch the application container.
          </p>
        </Sezione>

        <Sezione id="database" occhiello="Critical" titolo="5 · Backup, restore and what never to do">
          <p>
            The database is the only thing that cannot be rebuilt: the code recompiles, the content is in the files, but carts,
            orders and conversations are not. A full dump of this installation weighs a few hundred KB.
          </p>
          <CodeBlock code={snippetBackup} />
          <Attenzione lang="en">
            <code>docker compose down -v</code> deletes the <code>dbdata</code> volume, that is the whole database, without asking
            for confirmation. You never need it: to restart use <code>restart</code>, to update <code>up -d</code>. If someone
            suggests it «to clean up», that is the time you lose the data.
          </Attenzione>
        </Sezione>

        <Sezione id="chiavi" occhiello="Critical" titolo="6 · Secrets and key rotation">
          <p>
            The secrets live in a single file, with permissions <code>600</code> and outside the repository. Rotate them if
            someone has seen them, if the people with server access change, or as a habit once a year.
          </p>
          <CodeBlock code={snippetChiavi} />
          <Nota>
            The widget&apos;s public key (<code>WIDGET_PUBLIC_KEY</code>) is a special case: it is in plain text in the compose file
            and in the <Link href="/en/tutorial">tutorial</Link>, because it reaches everyone&apos;s browser anyway. Changing it stops
            the scripts that used it; whoever only pasted the <code>&lt;script&gt;</code> does not notice, because the widget page
            is served by the server.
          </Nota>
        </Sezione>

        <Sezione id="modello" occhiello="Critical" titolo="7 · Changing the model or the provider">
          <p>
            Free OpenRouter models run here: a preferred one, a backup and then the free router. Zero cost, but variable quality
            and a daily request cap. It is the right choice for a demo and the wrong one for a real shop, where a wrong answer
            costs more than half a euro a month.
          </p>
          <CodeBlock code={snippetModello} />
          <Tabella
            intestazioni={["What you see", "What is happening", "What to do"]}
            righe={[
              ["Slow or cut-off answers", "overloaded free provider", "pin a paid model in AI_MODEL"],
              ["It writes the tool JSON instead of using it", "a poor model picked by the router", "retry; if it happens again, pin a model"],
              ["429 from the provider", "over the free plan's 1000 a day", "wait for the next day or switch to paid"],
              ["401 error from the provider", "key revoked or expired", "new key in .env.production, then ./deploy.sh"],
            ]}
          />
        </Sezione>

        <Sezione id="limiti" occhiello="Routine" titolo="8 · Limits, quotas and 429s">
          <p>
            Limits do two things: stop a single person from using up everyone&apos;s quota, and stop the owner from paying for a
            bot&apos;s traffic. They are all in memory, with no external services.
          </p>
          <CodeBlock code={snippetLimiti} />
          <Tabella
            intestazioni={["Code", "Meaning", "Where to change it"]}
            righe={[
              ["429", "too many messages (visitor or whole site)", "src/lib/rate-limit.ts, CHAT_DAILY_LIMIT in the compose file"],
              ["401", "the x-cf-key key is missing or wrong", "WIDGET_PUBLIC_KEY in the compose file"],
              ["403", "foreign origin or non-JSON body (CSRF defence)", "src/lib/request.ts"],
              ["413", "request too large", "MAX_BODY in the route, request_body in Caddy"],
              ["503", "database unreachable", "chapter 9"],
            ]}
          />
        </Sezione>

        <Sezione id="guasti" occhiello="Emergency" titolo="9 · First aid: symptom, cause, command">
          <Tabella
            intestazioni={["Symptom", "Most likely cause", "First command"]}
            righe={[
              ["The site does not open", "Caddy stopped or certificate", "systemctl status caddy · journalctl -u caddy -n 50"],
              ["502 from the proxy", "app container not up", "docker compose ps · logs --tail 100 app"],
              ["The chat does not answer, the site does", "model provider or quota", "logs -f app while asking a question"],
              ["«I can't answer» for everyone", "database down", "curl /api/health · restart db"],
              ["Everyone gets 429", "global cap reached", "restart app (resets the counters) and raise the limits"],
              ["The widget disappears from external sites", "password extended to the widget paths", "chapter 10: restore the exclusions"],
              ["The app does not come back after a deploy", "failed migration or broken build", "./rollback.sh, then read the logs"],
              ["Disk full", "old Docker images", "docker system df · docker image prune -f"],
            ]}
          />
          <CodeBlock code={snippetPronto} />
        </Sezione>

        <Sezione id="proxy" occhiello="Critical" titolo="10 · Caddy: HTTPS, password, other sites">
          <p>
            This server&apos;s Caddyfile also hosts other sites: one syntax error takes them all down together. Backup,{" "}
            <code>validate</code>, <code>reload</code>: in this order, always.
          </p>
          <CodeBlock code={snippetCaddy} />
          <Attenzione lang="en">
            The <code>/widget.js</code> and <code>/embed</code> paths and the APIs must stay outside the password: they are the
            ones the widget uses inside the sites of whoever installed it. If you protect them, their visitors get a password
            prompt they cannot answer.
          </Attenzione>
        </Sezione>

        <Sezione id="privacy" occhiello="Critical" titolo="11 · Stored data and deletion">
          <p>
            Few tables, short retention and no plain IP addresses. It is the minimum needed to answer the question «what do you
            keep about me?» without reading the code.
          </p>
          <CodeBlock code={snippetPrivacy} />
          <Nota>
            In a real shop this page must come with a privacy notice and a way to delete a person&apos;s data on request. Here the
            data is test data, and the site says so to whoever comes in.
          </Nota>
        </Sezione>

        <Sezione id="checklist" occhiello="Routine" titolo="12 · The two lists to always follow">
          <CodeBlock code={snippetChecklist} />
          <p>
            The last line is what makes the difference between a maintained service and one that decays: write down what was done
            and when. In six months, the only person who will want to know is you.
          </p>
        </Sezione>
      </div>

      <div className="bg-card mt-12 rounded-lg border p-5">
        <p className="font-display text-xl">The other two pages</p>
        <ul className="mt-2 flex flex-col gap-1.5 text-[15px]">
          <li>
            <Link href="/en/manutenzione" className={link}>
              Maintenance
            </Link>{" "}
            — content, tone, fixes: the weekly work.
          </li>
          <li>
            <Link href="/en/tutorial" className={link}>
              Tutorial
            </Link>{" "}
            — how the assistant is built, from the database to the widget.
          </li>
        </ul>
      </div>
    </div>
  );
}
