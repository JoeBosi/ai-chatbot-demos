// Help centre content. It is shown on /assistenza and indexed for the assistant's
// searchHelp tool, so both always say the same thing. Sections are split on "## ".

export type HelpDoc = { slug: string; title: string; body: string };

export const helpDocs: HelpDoc[] = [
  {
    slug: "spedizioni",
    title: "Spedizioni",
    body: `## Costi di spedizione
La spedizione in Italia costa 6,90 € ed è gratuita per ordini da 49 € in su. Isole minori, Livigno e Campione d'Italia hanno un supplemento di 10 €. Per ora non spediamo fuori dall'Italia.

## Tempi di consegna
Gli ordini ricevuti entro le 13:00 dei giorni lavorativi partono lo stesso giorno. La consegna richiede 24-48 ore nel Nord e Centro Italia e 48-72 ore nel Sud e nelle isole. Il caffè viene tostato il lunedì e il giovedì: se l'ordine contiene caffè, può partire al massimo 3 giorni dopo.

## Corrieri e tracciamento
Spediamo con corriere espresso. Quando l'ordine parte ricevi un'email con il codice di tracciamento; puoi anche chiedere lo stato all'assistente indicando numero d'ordine ed email usata per l'acquisto.

## Ritiro in negozio
Il ritiro nel nostro laboratorio di Parma è gratuito e disponibile dal giorno lavorativo successivo all'ordine, dal lunedì al sabato, 9:00-19:00.`,
  },
  {
    slug: "resi-e-rimborsi",
    title: "Resi e rimborsi",
    body: `## Diritto di recesso
Hai 30 giorni dalla consegna per restituire qualsiasi prodotto, anche se la confezione è stata aperta, purché il prodotto sia integro, pulito e con tutti gli accessori. Le macchine espresso usate per preparare caffè vanno restituite pulite e decalcificate.

## Prodotti non restituibili
Il caffè in grani o macinato con la confezione aperta non si può restituire per motivi igienici. Le confezioni di caffè chiuse sono restituibili entro 30 giorni.

## Come fare un reso
Apri una richiesta di assistenza indicando numero d'ordine e prodotto: ti inviamo l'etichetta prepagata entro 1 giorno lavorativo. Il reso è gratuito se il prodotto è difettoso o sbagliato; negli altri casi il costo dell'etichetta è 6,90 € e viene trattenuto dal rimborso.

## Tempi del rimborso
Rimborsiamo sullo stesso metodo di pagamento entro 5 giorni lavorativi dall'arrivo del reso in magazzino. Con PayPal il rimborso è visibile subito, con carta può richiedere fino a 10 giorni a seconda della banca.

## Cambio prodotto
Se vuoi cambiare un prodotto con un altro, conviene fare il reso e un nuovo ordine: così il nuovo prodotto parte subito senza aspettare il rientro.`,
  },
  {
    slug: "garanzia",
    title: "Garanzia e assistenza tecnica",
    body: `## Durata della garanzia
Tutti i prodotti elettrici hanno la garanzia legale di 2 anni. Le macchine e i macinacaffè Officine Brenta hanno 3 anni di garanzia. La garanzia copre i difetti di fabbricazione, non l'usura delle guarnizioni né i danni da calcare.

## Cosa fare in caso di guasto
Apri una richiesta di assistenza descrivendo il problema e, se puoi, allega un video. Un tecnico ti risponde entro 2 giorni lavorativi. Se la riparazione è in garanzia, il ritiro e la riconsegna a casa sono gratuiti.

## Calcare e garanzia
I guasti causati dal calcare non sono coperti. Per questo consigliamo di decalcificare la macchina ogni 2 mesi con acqua dura o ogni 4 mesi con acqua addolcita, e di usare acqua con durezza sotto i 10 °f.

## Ricambi
Guarnizioni del gruppo, filtri, doccette e portafiltri sono disponibili per tutte le macchine vendute negli ultimi 10 anni. Chiedi all'assistenza il codice del ricambio.`,
  },
  {
    slug: "pagamenti",
    title: "Pagamenti",
    body: `## Metodi accettati
Accettiamo carte di credito e debito dei circuiti Visa, Mastercard e American Express, PayPal, Apple Pay, Google Pay e bonifico bancario.

## Pagamento in 3 rate
Per ordini da 150 € a 2000 € puoi pagare in 3 rate senza interessi con PayPal. La prima rata viene addebitata alla spedizione.

## Bonifico
Con il bonifico l'ordine viene preparato quando riceviamo l'accredito, di solito in 1-2 giorni lavorativi. Se non riceviamo il pagamento entro 7 giorni l'ordine viene annullato.

## Fattura
Puoi richiedere la fattura inserendo partita IVA o codice fiscale durante il checkout. Non possiamo emettere fattura dopo la spedizione dell'ordine.`,
  },
  {
    slug: "ordini",
    title: "Modificare o annullare un ordine",
    body: `## Modificare un ordine
Puoi modificare indirizzo o prodotti finché l'ordine è nello stato "ricevuto". Apri una richiesta di assistenza con il numero d'ordine: se l'ordine è già in preparazione non possiamo più modificarlo.

## Annullare un ordine
Un ordine non ancora spedito si può annullare gratuitamente con una richiesta di assistenza; il rimborso parte entro 2 giorni lavorativi. Se l'ordine è già spedito, puoi rifiutare la consegna o fare un reso.

## Stati dell'ordine
Ricevuto: abbiamo registrato l'ordine. In preparazione: il magazzino lo sta imballando. Spedito: il corriere lo ha ritirato e il tracciamento è attivo. In consegna: è sul furgone per la consegna di oggi. Consegnato: il corriere ha registrato la consegna.

## Pacco in ritardo o danneggiato
Se il pacco è in ritardo di oltre 2 giorni rispetto alla stima o arriva danneggiato, accetta con riserva scrivendo "merce danneggiata" e apri subito una richiesta di assistenza con le foto.`,
  },
  {
    slug: "scegliere-la-macchina",
    title: "Guida: scegliere la macchina espresso",
    body: `## Quanto spendere
Sotto i 250 € le macchine usano filtri pressurizzati: perdonano una macinatura imprecisa e funzionano con il caffè già macinato, ma il margine di miglioramento è limitato. Tra 300 e 700 € si passa ai portafiltri professionali da 58 mm, che richiedono un macinacaffè da espresso. Oltre i 1000 € si trovano doppie caldaie e pompe rotative.

## Se bevi soprattutto cappuccini
Per il latte conta la lancia vapore. Il panarello è facile ma non permette la latte art. Una lancia professionale a doppio foro permette la microschiuma. Con una doppia caldaia puoi estrarre e montare il latte contemporaneamente.

## Il budget del macinacaffè
Con una macchina a portafiltro professionale, il macinacaffè conta quanto la macchina. Una regola pratica è dedicare al macinacaffè almeno metà del budget della macchina. Senza un macinacaffè adatto, scegli una macchina con filtri pressurizzati.

## Superautomatica o portafiltro
La superautomatica macina ed estrae da sola ed è ideale per chi vuole comodità e più persone in casa. La macchina a portafiltro richiede qualche minuto e pratica ma dà un espresso migliore e personalizzabile.`,
  },
  {
    slug: "macinatura",
    title: "Guida: la macinatura giusta per ogni metodo",
    body: `## Espresso
Serve una macinatura fine, simile allo zucchero a velo ma non polverosa. Un espresso doppio usa 18 g di caffè per 36 g in tazza in 25-30 secondi. Se esce troppo veloce macina più fine, se esce troppo lento macina più grosso.

## Moka
Macinatura media-fine, più grossa dell'espresso. Riempi il filtro senza pressare e usa acqua già calda nella caldaia per evitare il sapore bruciato.

## Filtro
Macinatura media, simile al sale fino. Rapporto consigliato: 60 g di caffè per litro d'acqua a 93-96 °C, tempo totale 3-4 minuti.

## Pressa francese
Macinatura grossa, simile al sale grosso. 60-70 g per litro, infusione di 4 minuti, poi premi lentamente.`,
  },
  {
    slug: "conservazione",
    title: "Guida: conservare il caffè",
    body: `## Quando berlo
Il caffè in grani dà il meglio tra 7 e 30 giorni dalla tostatura per l'espresso e tra 5 e 21 giorni per il filtro. Sul sacchetto trovi sempre la data di tostatura.

## Dove conservarlo
Tieni i grani nel sacchetto originale con valvola, chiuso bene, lontano da luce e calore. Il frigorifero è sconsigliato perché l'umidità rovina gli aromi. Il freezer va bene solo per porzioni sottovuoto da non ricongelare.

## Macinato o grani
Il caffè macinato perde gran parte degli aromi in 15-30 minuti. Se puoi, macina subito prima dell'estrazione.`,
  },
  {
    slug: "manutenzione",
    title: "Guida: manutenzione della macchina espresso",
    body: `## Ogni giorno
Dopo l'ultimo caffè risciacqua il portafiltro, fai scorrere acqua dal gruppo e pulisci la lancia vapore con un panno umido subito dopo ogni uso.

## Ogni settimana
Nelle macchine con valvola a tre vie fai un lavaggio con filtro cieco e pastiglia detergente. Smonta e lava la doccetta del gruppo.

## Decalcificazione
Decalcifica ogni 2 mesi con acqua dura, ogni 4 con acqua addolcita. Usa un decalcificante a base di acido lattico o citrico specifico per macchine da caffè, mai l'aceto, che danneggia le guarnizioni.

## Guarnizione del gruppo
Sostituisci la guarnizione del gruppo ogni 12-18 mesi, o prima se il portafiltro arriva a fine corsa o perde acqua ai lati.`,
  },
  {
    slug: "negozio",
    title: "Chi siamo e contatti",
    body: `## Il negozio
Crema & Ferro è un negozio di attrezzatura per il caffè con torrefazione e laboratorio a Parma. Questo sito è una demo: prodotti, prezzi e ordini sono inventati e nessun pagamento è reale.

## Contatti
L'assistenza risponde dal lunedì al venerdì, 9:00-18:00. Il modo più rapido è chiedere all'assistente del sito, che può aprire una richiesta di assistenza per te. Tempo medio di risposta alle richieste: 1 giorno lavorativo.

## Corsi
Nel laboratorio di Parma organizziamo corsi di espresso e latte art il sabato mattina, 3 ore, 69 € a persona, massimo 6 partecipanti.`,
  },
];
