import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/store/shop";
import { categories } from "@/data/products";
import { inr } from "@/lib/format";
import { SearchIcon } from "@/components/Icons";

type ShopSearch = { q?: string; category?: string; sort?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
    category: typeof search["category"] === "string" ? (search["category"] as string) : "All",
    sort: typeof search["sort"] === "string" ? (search["sort"] as string) : "featured",
  }),
  head: () => ({
    meta: [
      { title: "Shop Ethnic Wear Online — Radhika Collection" },
      {
        name: "description",
        content:
          "Browse sarees, lehengas, anarkali suits, kurtis, sharara sets and dupattas with filters for category, price and fabric.",
      },
      { property: "og:title", content: "Shop Ethnic Wear — Radhika Collection" },
      {
        property: "og:description",
        content: "Filter and sort our full range of Indian women's ethnic wear.",
      },
    ],
  }),
  component: ShopPage,
});

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A–Z" },
];

const priceBands = [
  { value: "all", label: "All prices", min: 0, max: Infinity },
  { value: "u2000", label: "Under ₹2,000", min: 0, max: 2000 },
  { value: "2-6", label: "₹2,000 – ₹6,000", min: 2000, max: 6000 },
  { value: "6-12", label: "₹6,000 – ₹12,000", min: 6000, max: 12000 },
  { value: "12p", label: "Above ₹12,000", min: 12000, max: Infinity },
];

function ShopPage() {
  const { products } = useShop();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const q = search.q ?? "";
  const category = search.category ?? "All";
  const sort = search.sort ?? "featured";
  const [band, setBand] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [localQuery, setLocalQuery] = useState(q);

  function setSearch(next: ShopSearch) {
    navigate({ search: (prev) => ({ ...prev, ...next }) });
  }

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const priceBand = priceBands.find((b) => b.value === band) ?? { value: "all", label: "All prices", min: 0, max: Infinity };
    let list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (p.price < priceBand.min || p.price > priceBand.max) return false;
      if (inStockOnly && p.stock === 0) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.fabric.toLowerCase().includes(term) ||
        p.colors.join(" ").toLowerCase().includes(term)
      );
    });
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, q, category, sort, band, inStockOnly]);

  const filterChip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
    }`;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="The Collection"
        title={category === "All" ? "All Products" : category}
        subtitle="Every piece is quality checked in our Pune studio before it ships."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Filters */}
          <aside className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearch({ q: localQuery.trim() });
              }}
            >
              <label htmlFor="shop-search" className="text-sm font-semibold uppercase tracking-[0.14em]">
                Search
              </label>
              <div className="mt-3 flex items-center rounded-md border border-border bg-card px-3 py-2">
                <SearchIcon className="h-4 w-4 text-muted-foreground" />
                <input
                  id="shop-search"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Saree, silk, blush…"
                  className="w-full bg-transparent px-2 text-sm outline-none"
                />
              </div>
            </form>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em]">Category</p>
              <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                {["All", ...categories].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSearch({ category: c })}
                    className={filterChip(category === c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em]">Price</p>
              <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                {priceBands.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => setBand(b.value)}
                    className={filterChip(band === b.value)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 accent-[oklch(0.36_0.13_15)]"
              />
              In stock only
            </label>

            <button
              type="button"
              onClick={() => {
                setBand("all");
                setInStockOnly(false);
                setLocalQuery("");
                setSearch({ q: "", category: "All", sort: "featured" });
              }}
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Clear all filters
            </button>
          </aside>

          {/* Results */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <p className="text-sm text-muted-foreground">
                {results.length} {results.length === 1 ? "product" : "products"}
                {q ? ` for “${q}”` : ""}
              </p>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSearch({ sort: e.target.value })}
                  className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {results.length === 0 ? (
              <div className="mt-16 text-center">
                <h2 className="text-2xl font-semibold">No products found</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
                  We couldn't find anything matching your filters. Try a different category
                  or clear the search.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBand("all");
                    setInStockOnly(false);
                    setLocalQuery("");
                    setSearch({ q: "", category: "All", sort: "featured" });
                  }}
                  className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {results.length > 0 && (
              <p className="mt-8 text-xs text-muted-foreground">
                Prices shown in INR and inclusive of all taxes. Lowest price in this view:{" "}
                {inr(Math.min(...results.map((r) => r.price)))}.
              </p>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
