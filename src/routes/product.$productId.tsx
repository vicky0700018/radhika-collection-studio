import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/store/shop";
import { productImages } from "@/data/products";
import { discountPct, inr } from "@/lib/format";
import { HeartIcon, ShieldIcon, StarIcon, TruckIcon } from "@/components/Icons";

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => ({
    meta: [
      { title: `Product ${params.productId} — Radhika Collection` },
      {
        name: "description",
        content:
          "View fabric, work, sizes and pricing for this Radhika Collection ethnic wear piece.",
      },
      { property: "og:title", content: "Product Details — Radhika Collection" },
      {
        property: "og:description",
        content: "Fabric, craftsmanship and sizing details for this ethnic wear piece.",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const { getProduct, products, addToCart, toggleWishlist, inWishlist } = useShop();
  const navigate = useNavigate();
  const product = getProduct(productId);

  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold">Product not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This piece may have been removed from the catalogue.
          </p>
          <Link
            to="/shop"
            search={{ q: "", category: "All", sort: "featured" }}
            className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Back to shop
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const off = discountPct(product.price, product.mrp);
  const saved = inWishlist(product.id);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  function requireSize(): string | null {
    if (!product) return null;
    if (product.sizes.length === 1) return product.sizes[0] ?? "Free Size";
    if (!size) {
      setError("Please select a size first.");
      return null;
    }
    return size;
  }

  return (
    <SiteLayout>
      <nav className="mx-auto max-w-7xl px-4 pt-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link
          to="/shop"
          search={{ q: "", category: product.category, sort: "featured" }}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-border bg-cream">
          <img
            src={productImages[product.imageKey]}
            alt={product.name}
            width={800}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{product.category}</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4" filled={i < Math.round(product.rating)} />
              ))}
            </span>
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} · {product.reviews} reviews
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-primary">{inr(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">{inr(product.mrp)}</span>
                <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                  {off}% OFF
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Fabric</dt>
              <dd className="mt-1 font-medium">{product.fabric}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Work</dt>
              <dd className="mt-1 font-medium">{product.work}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Colours</dt>
              <dd className="mt-1 font-medium">{product.colors.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">SKU</dt>
              <dd className="mt-1 font-medium">{product.id}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="text-sm font-semibold">
              Size{product.sizes.length > 1 ? "" : ""}
              {size && <span className="ml-2 font-normal text-muted-foreground">{size}</span>}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setError("");
                  }}
                  className={`min-w-14 rounded-md border px-4 py-2 text-sm transition-colors ${
                    size === s || product.sizes.length === 1
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="px-4 py-2 text-lg"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((n) => Math.min(10, n + 1))}
                className="px-4 py-2 text-lg"
              >
                +
              </button>
            </div>
            <p className={`text-sm ${product.stock > 0 ? "text-muted-foreground" : "text-destructive"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={product.stock === 0}
              onClick={() => {
                const s = requireSize();
                if (!s) return;
                addToCart(product.id, s, qty);
              }}
              className="flex-1 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to bag
            </button>
            <button
              type="button"
              disabled={product.stock === 0}
              onClick={() => {
                const s = requireSize();
                if (!s) return;
                addToCart(product.id, s, qty);
                navigate({ to: "/checkout" });
              }}
              className="flex-1 rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy now
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle wishlist"
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-md border border-border ${
                saved ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <HeartIcon filled={saved} />
            </button>
          </div>

          <div className="mt-8 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:grid-cols-2">
            <p className="flex items-center gap-2"><TruckIcon className="h-4 w-4 text-gold" /> Ships in 2–4 business days</p>
            <p className="flex items-center gap-2"><ShieldIcon className="h-4 w-4 text-gold" /> 7-day easy returns</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">You may also like</h2>
          <div className="gold-rule mt-4 w-24" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
