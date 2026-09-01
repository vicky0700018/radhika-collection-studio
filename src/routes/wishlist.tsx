import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Radhika Collection" },
      { name: "description", content: "The ethnic wear pieces you have saved for later." },
      { property: "og:title", content: "Wishlist — Radhika Collection" },
      { property: "og:description", content: "Your saved sarees, lehengas and suit sets." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, products } = useShop();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <SiteLayout>
      <PageHeader eyebrow="Saved for later" title="My Wishlist" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-2xl font-semibold">Nothing saved yet</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              Tap the heart on any product to keep it here while you browse.
            </p>
            <Link
              to="/shop"
              search={{ q: "", category: "All", sort: "featured" }}
              className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{items.length} saved {items.length === 1 ? "piece" : "pieces"}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
