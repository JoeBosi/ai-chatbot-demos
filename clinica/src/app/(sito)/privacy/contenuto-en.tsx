import Link from "next/link";

// English version of the privacy page. Same facts as the Italian one: retention, recipient, what is not there.
export function PrivacyEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Privacy</h1>
      <p className="mt-4 text-lg leading-relaxed">
        This is a teaching site: the clinic is made up and no booking reaches anyone. Below is exactly what happens to the data
        you write, because even in an example it is worth knowing.
      </p>

      <section className="mt-10" aria-labelledby="cosa">
        <h2 id="cosa" className="font-display text-3xl">
          What is kept
        </h2>
        <dl className="mt-5 divide-y border-y">
          <div className="py-4">
            <dt className="font-semibold">Conversations with the assistant</dt>
            <dd className="text-muted-foreground mt-1 leading-relaxed">
              They stay in the site&apos;s database for <strong>30 days</strong>, then they are deleted automatically. They are used
              to read what people ask and to fix wrong answers. They are not linked to a name: instead of the IP address, a
              fingerprint (a salted hash) is stored, from which the address cannot be rebuilt.
            </dd>
          </div>
          <div className="py-4">
            <dt className="font-semibold">Test bookings</dt>
            <dd className="text-muted-foreground mt-1 leading-relaxed">
              The name, email and phone written in the form stay for <strong>7 days</strong> and are then deleted. That is why the
              form asks you to use made-up details: the example works just the same.
            </dd>
          </div>
          <div className="py-4">
            <dt className="font-semibold">The chat history in your browser</dt>
            <dd className="text-muted-foreground mt-1 leading-relaxed">
              To find the conversation again after a reload, the browser keeps it in its own local storage (localStorage) on your
              device. It is cleared with the «New conversation» button or by clearing the site&apos;s data.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10" aria-labelledby="dove">
        <h2 id="dove" className="font-display text-3xl">
          Where the questions go
        </h2>
        <p className="mt-4 leading-relaxed">
          The text you write to the assistant, together with the site documents needed to answer, is sent to{" "}
          <a href="https://openrouter.ai/privacy" className="text-enamel underline decoration-dotted underline-offset-4" rel="noreferrer noopener" target="_blank">
            OpenRouter
          </a>
          , the service that runs the language model: it is the only external recipient. That is another reason not to use the
          chat for real personal data. The search by meaning in the documents, on the other hand, runs on the site&apos;s server.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="no">
        <h2 id="no" className="font-display text-3xl">
          What is not there
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed">
          <li>No profiling cookies and no statistics service: the site uses no traffic analysis tools.</li>
          <li>No third-party resources loaded while you browse: fonts, icons and scripts are served by the site itself.</li>
          <li>No connection to registers, health records or external services: the assistant only knows this site&apos;s pages.</li>
          <li>No name or email is collected to use the chat: you just write.</li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="chi">
        <h2 id="chi" className="font-display text-3xl">
          Who is responsible
        </h2>
        <p className="mt-4 leading-relaxed">
          The site is a teaching project by Prof. Giuseppe Bosi (see{" "}
          <Link href="/en/crediti" className="text-enamel underline decoration-dotted underline-offset-4">
            Credits
          </Link>
          ). To have a test booking or conversation deleted straight away, just ask through the contacts on the home page of his
          projects: the rows can be found with the booking code or with the date and time of the chat.
        </p>
      </section>
    </div>
  );
}
