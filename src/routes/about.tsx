import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { business } from "@/data/mock";
import storeImage from "@/assets/hero.jpg";
import artisanImage from "@/assets/dupatta-set.jpg";
import { ShieldIcon, SparkleIcon, TruckIcon } from "@/components/Icons";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Radhika Collection — Ethnic Wear Boutique in Pune" },
      {
        name: "description",
        content:
          "Founded in 2012 on Laxmi Road, Pune, Radhika Collection curates handwoven sarees and hand-embroidered lehengas directly from Indian artisans.",
      },
      { property: "og:title", content: "About Radhika Collection" },
      {
        property: "og:description",
        content: "Our story, craft partners and promise to every customer.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our story"
        title="Craft, colour and continuity"
        subtitle={`${business.name} has dressed Indian women for weddings, festivals and everyday grace since ${business.established}.`}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold">From a single Laxmi Road counter</h2>
          <div className="gold-rule my-5 w-24" />
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              {business.owner} started with a modest counter of Banarasi sarees and a simple
              belief: an ethnic wardrobe should feel personal, not mass produced. Fourteen
              years later, the boutique works directly with weaving families in Varanasi,
              block printers in Bagru and chikankari artisans in Lucknow.
            </p>
            <p>
              Every piece we list is inspected in our Pune studio for fall, finish and
              colourfastness. If a garment doesn't pass, it doesn't reach you.
            </p>
            <p>
              Today we serve over 14,000 customers across India — brides, mothers, working
              women and daughters shopping for their first silk saree.
            </p>
          </div>
        </div>
        <img
          src={storeImage}
          alt="Radhika Collection boutique interior with draped ethnic fabrics"
          loading="lazy"
          width={1600}
          height={900}
          className="rounded-2xl border border-border object-cover shadow-lg"
        />
      </section>

      <section className="bg-cream py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold">What we promise</h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: SparkleIcon, title: "Artisan first", text: "We buy directly from weaver clusters and pay fair, upfront rates for every handwoven metre." },
              { icon: ShieldIcon, title: "Honest quality", text: "Fabric and work are described exactly as they are — no inflated MRPs, no false 'pure silk' claims." },
              { icon: TruckIcon, title: "Careful delivery", text: "Each order is packed in a reusable cloth bag and dispatched within two working days." },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <v.icon className="h-6 w-6 text-gold" />
                <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <img
          src={artisanImage}
          alt="Stack of handwoven maroon and cream dupattas with gold borders"
          loading="lazy"
          width={800}
          height={1000}
          className="order-2 max-h-[28rem] w-full rounded-2xl border border-border object-cover lg:order-1"
        />
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl font-semibold">Visit us in Pune</h2>
          <div className="gold-rule my-5 w-24" />
          <p className="text-sm leading-relaxed text-muted-foreground">{business.address}</p>
          <p className="mt-3 text-sm text-muted-foreground">Open {business.hours}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Call {business.phone} · {business.email}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
              Get in touch
            </Link>
            <Link
              to="/shop"
              search={{ q: "", category: "All", sort: "featured" }}
              className="rounded-md border border-primary px-6 py-3 text-sm font-medium text-primary"
            >
              Shop online
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
