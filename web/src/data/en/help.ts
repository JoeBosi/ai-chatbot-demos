import { helpDocs, type HelpDoc } from "@/data/help";

// English help centre, shown on /en/assistenza. Same slugs and the same "## " sections as the
// Italian docs in ../help.ts, which remain the ones the assistant searches.
export const helpDocsEn: HelpDoc[] = [
  {
    slug: "spedizioni",
    title: "Shipping",
    body: `## Shipping costs
Shipping within Italy costs 6.90 € and is free for orders of 49 € or more. Minor islands, Livigno and Campione d'Italia carry a 10 € surcharge. For now we do not ship outside Italy.

## Delivery times
Orders received by 13:00 on working days leave the same day. Delivery takes 24-48 hours in Northern and Central Italy and 48-72 hours in the South and on the islands. Coffee is roasted on Mondays and Thursdays: if the order contains coffee, it may leave up to 3 days later.

## Couriers and tracking
We ship by express courier. When the order leaves you receive an email with the tracking code; you can also ask the assistant for the status, giving the order number and the email used for the purchase.

## Collection in the shop
Collection from our workshop in Parma is free and available from the working day after the order, Monday to Saturday, 9:00-19:00.`,
  },
  {
    slug: "resi-e-rimborsi",
    title: "Returns and refunds",
    body: `## Right of withdrawal
You have 30 days from delivery to return any product, even if the box has been opened, as long as the product is undamaged, clean and complete with all accessories. Espresso machines that have been used to make coffee must be returned clean and descaled.

## Products that cannot be returned
Coffee beans or ground coffee in an opened pack cannot be returned for hygiene reasons. Sealed coffee packs can be returned within 30 days.

## How to return
Open a support request with the order number and the product: we send you a prepaid label within 1 working day. The return is free if the product is faulty or wrong; otherwise the label costs 6.90 €, deducted from the refund.

## Refund times
We refund to the same payment method within 5 working days of the return reaching the warehouse. With PayPal the refund shows up straight away; with a card it can take up to 10 days depending on the bank.

## Exchanging a product
If you want to swap a product for another, it is best to return it and place a new order: the new product leaves straight away without waiting for the return.`,
  },
  {
    slug: "garanzia",
    title: "Warranty and technical support",
    body: `## Warranty length
All electrical products have the 2-year legal warranty. Officine Brenta machines and grinders have a 3-year warranty. The warranty covers manufacturing defects, not worn gaskets or limescale damage.

## What to do if something breaks
Open a support request describing the problem and, if you can, attach a video. A technician replies within 2 working days. If the repair is under warranty, pick-up and return to your home are free.

## Limescale and the warranty
Faults caused by limescale are not covered. That is why we recommend descaling the machine every 2 months with hard water or every 4 months with softened water, and using water with a hardness below 10 °f.

## Spare parts
Group gaskets, baskets, shower screens and portafilters are available for every machine sold in the last 10 years. Ask support for the part code.`,
  },
  {
    slug: "pagamenti",
    title: "Payments",
    body: `## Accepted methods
We accept Visa, Mastercard and American Express credit and debit cards, PayPal, Apple Pay, Google Pay and bank transfer.

## Paying in 3 instalments
For orders from 150 € to 2000 € you can pay in 3 interest-free instalments with PayPal. The first instalment is charged when the order ships.

## Bank transfer
With a bank transfer the order is prepared once the payment arrives, usually in 1-2 working days. If we do not receive the payment within 7 days the order is cancelled.

## Invoice
You can request an invoice by entering a VAT number or tax code at checkout. We cannot issue an invoice after the order has shipped.`,
  },
  {
    slug: "ordini",
    title: "Changing or cancelling an order",
    body: `## Changing an order
You can change the address or the products while the order is "received". Open a support request with the order number: once the order is being prepared we can no longer change it.

## Cancelling an order
An order that has not shipped yet can be cancelled free of charge with a support request; the refund starts within 2 working days. If the order has already shipped, you can refuse the delivery or make a return.

## Order statuses
Received: we have recorded the order. Being prepared: the warehouse is packing it. Shipped: the courier has collected it and tracking is active. Out for delivery: it is on the van for today's delivery. Delivered: the courier has recorded the delivery.

## Late or damaged parcel
If the parcel is more than 2 days late compared with the estimate or arrives damaged, accept it with reservation by writing "goods damaged" and open a support request straight away with photos.`,
  },
  {
    slug: "scegliere-la-macchina",
    title: "Guide: choosing an espresso machine",
    body: `## How much to spend
Below 250 € machines use pressurised baskets: they forgive an imprecise grind and work with pre-ground coffee, but there is little room to improve. Between 300 and 700 € you move to professional 58 mm portafilters, which need an espresso grinder. Above 1000 € you find dual boilers and rotary pumps.

## If you mostly drink cappuccinos
For milk, the steam wand is what matters. A panarello is easy but does not allow latte art. A professional two-hole wand makes microfoam. With a dual boiler you can pull a shot and steam milk at the same time.

## The grinder budget
With a professional portafilter machine, the grinder matters as much as the machine. A practical rule is to spend at least half of the machine budget on the grinder. Without a suitable grinder, choose a machine with pressurised baskets.

## Bean-to-cup or portafilter
A bean-to-cup machine grinds and extracts on its own and is ideal if you want convenience and have several people at home. A portafilter machine takes a few minutes and some practice but gives a better espresso that you can fine-tune.`,
  },
  {
    slug: "macinatura",
    title: "Guide: the right grind for each method",
    body: `## Espresso
You need a fine grind, like icing sugar but not powdery. A double espresso uses 18 g of coffee for 36 g in the cup in 25-30 seconds. If it runs too fast grind finer, if it runs too slow grind coarser.

## Moka
Medium-fine grind, coarser than espresso. Fill the basket without tamping and put hot water in the base to avoid a burnt taste.

## Filter
Medium grind, like fine salt. Recommended ratio: 60 g of coffee per litre of water at 93-96 °C, total time 3-4 minutes.

## French press
Coarse grind, like coarse salt. 60-70 g per litre, 4 minutes of brewing, then press slowly.`,
  },
  {
    slug: "conservazione",
    title: "Guide: storing coffee",
    body: `## When to drink it
Coffee beans are at their best between 7 and 30 days after roasting for espresso and between 5 and 21 days for filter. The roast date is always on the bag.

## Where to keep it
Keep the beans in the original bag with its valve, tightly closed, away from light and heat. The fridge is not recommended because moisture spoils the aromas. The freezer is fine only for vacuum-packed portions that you do not refreeze.

## Ground or beans
Ground coffee loses most of its aroma in 15-30 minutes. If you can, grind just before brewing.`,
  },
  {
    slug: "manutenzione",
    title: "Guide: looking after an espresso machine",
    body: `## Every day
After the last coffee rinse the portafilter, run water through the group head and wipe the steam wand with a damp cloth straight after each use.

## Every week
On machines with a three-way valve, backflush with a blind basket and a cleaning tablet. Remove and wash the group shower screen.

## Descaling
Descale every 2 months with hard water, every 4 with softened water. Use a lactic- or citric-acid descaler made for coffee machines, never vinegar, which damages the gaskets.

## Group gasket
Replace the group gasket every 12-18 months, or sooner if the portafilter reaches the end of its travel or leaks water at the sides.`,
  },
  {
    slug: "negozio",
    title: "About us and contacts",
    body: `## The shop
Crema & Ferro is a coffee-gear shop with a roastery and workshop in Parma. This site is a demo: products, prices and orders are made up and no payment is real.

## Contacts
Support answers Monday to Friday, 9:00-18:00. The quickest way is to ask the site's assistant, which can open a support request for you. Average reply time: 1 working day.

## Courses
In the Parma workshop we run espresso and latte art courses on Saturday mornings: 3 hours, 69 € per person, at most 6 people.`,
  },
];

// Titles and section names as the assistant's sources show them ("Spedizioni › Tempi di consegna").
// Built by pairing the two languages doc by doc and section by section.
export const helpTitleEn: Record<string, string> = {};
export const helpSectionEn: Record<string, string> = {};
const headings = (body: string) => body.split("\n").filter((l) => l.startsWith("## ")).map((l) => l.slice(3).trim());
for (const doc of helpDocs) {
  const en = helpDocsEn.find((d) => d.slug === doc.slug);
  if (!en) continue;
  helpTitleEn[doc.title] = en.title;
  const itHeads = headings(doc.body);
  const enHeads = headings(en.body);
  itHeads.forEach((h, i) => {
    if (enHeads[i]) helpSectionEn[h] = enHeads[i];
  });
}
