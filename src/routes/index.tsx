import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/store/shop";
import { categories, categoryImage, productImages } from "@/data/products";
import { business } from "@/data/mock";
import heroImage from "@/assets/saree-maroon.jpg";
import { ShieldIcon, SparkleIcon, StarIcon, TruckIcon } from "@/components/Icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Radhika Collection — Women's Ethnic Wear in Pune" },
      {
        name: "description",
        content:
          "Shop handpicked sarees, bridal lehengas, anarkalis, kurtis and dupattas in premium fabrics. Trusted Indian ethnic wear boutique since 2012.",
      },
      { property: "og:title", content: "Radhika Collection — Women's Ethnic Wear" },
      {
        property: "og:description",
        content: "Handpicked sarees, lehengas and suit sets for weddings and festivals.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { products } = useShop();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newArrivals = products.filter((p) => p.tag === "New").slice(0, 4);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="order-2 lg:order-1">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">
              Since {business.established} · Pune
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              Drape yourself in
              <span className="block text-primary">timeless tradition</span>
            </h1>
            <div className="gold-rule my-6 w-32" />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Handwoven Banarasi silks, hand-embroidered bridal lehengas and everyday
              cottons — curated by {business.owner} for women who wear their heritage
              beautifully.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                search={{ q: "", category: "All", sort: "featured" }}
                className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Shop the collection
              </Link>
              <Link
                to="/shop"
                search={{ q: "", category: "Lehengas", sort: "featured" }}
                className="rounded-md border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Bridal edit
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              <div>
                <dt className="text-2xl font-semibold text-primary">14k+</dt>
                <dd className="text-xs text-muted-foreground">Happy customers</dd>
              </div>
              <div>
                <dt className="text-2xl font-semibold text-primary">{products.length}+</dt>
                <dd className="text-xs text-muted-foreground">Curated styles</dd>
              </div>
              <div>
                <dt className="text-2xl font-semibold text-primary">4.8★</dt>
                <dd className="text-xs text-muted-foreground">Average rating</dd>
              </div>
            </dl>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-gold/40 shadow-2xl shadow-primary/10">
              <img
                src={heroImage}
                alt="Model wearing a maroon Banarasi silk saree from Radhika Collection"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-lg bg-background/90 px-4 py-3 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">Festive 2026</p>
                <p className="text-sm font-semibold">Banarasi Silk Edit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: TruckIcon, title: "Free shipping", text: "On orders above ₹2,999" },
            { icon: ShieldIcon, title: "Easy 7-day returns", text: "No-questions exchange" },
            { icon: SparkleIcon, title: "Artisan crafted", text: "Direct from weavers" },
            { icon: StarIcon, title: "Loved by 14k+", text: "Rated 4.8 out of 5" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Browse</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Shop by category</h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ q: "", category: c, sort: "featured" }}
              className="card-lift group relative block overflow-hidden rounded-xl border border-border"
            >
              <img
                src={productImages[categoryImage[c]]}
                alt={`${c} collection`}
                loading="lazy"
                width={800}
                height={1000}
                className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
                <p className="font-display text-lg font-semibold text-background sm:text-xl">{c}</p>
                <p className="text-xs text-background/80">
                  {products.filter((p) => p.category === c).length} styles
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-cream py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Handpicked</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Featured pieces</h2>
            </div>
            <Link
              to="/shop"
              search={{ q: "", category: "All", sort: "featured" }}
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              View all products
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Just in</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">New arrivals</h2>
            <div className="gold-rule mx-auto mt-4 w-24" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="border-y border-border bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">
            What our customers say
          </h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Ananya D., Pune",
                text: "The Banarasi saree I ordered for my sister's wedding was even richer in person. The zari work is genuinely handwoven.",
              },
              {
                name: "Meera I., Bengaluru",
                text: "My mehendi lehenga fit perfectly and the mirror work held up through a full night of dancing. Beautifully finished.",
              },
              {
                name: "Harleen K., Ludhiana",
                text: "I keep coming back for the cotton kurtis — soft, well stitched and the block prints don't fade after washes.",
              },
            ].map((t) => (
              <figure key={t.name} className="rounded-xl border border-border bg-card p-6">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-semibold sm:text-4xl">Visit our Pune boutique</h2>
          <p className="mt-4 text-sm text-primary-foreground/80 sm:text-base">
            {business.address}. Open {business.hours}. Personal styling appointments
            available on request.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground"
            >
              Book an appointment
            </Link>
            <a
              href={`tel:${business.phone.replace(/\s/g, "")}`}
              className="rounded-md border border-primary-foreground/40 px-6 py-3 text-sm font-medium"
            >
              Call {business.phone}
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
