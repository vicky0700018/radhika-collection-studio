import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { useShop } from "@/store/shop";
import { productImages } from "@/data/products";
import { inr } from "@/lib/format";
import { TrashIcon } from "@/components/Icons";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Bag — Radhika Collection" },
      { name: "description", content: "Review the ethnic wear pieces in your shopping bag before checkout." },
      { property: "og:title", content: "Shopping Bag — Radhika Collection" },
      { property: "og:description", content: "Review your selected sarees, lehengas and suits." },
    ],
  }),
  component: CartPage,
});

export function CartPage() {
  const { cart, getProduct, updateQty, removeFromCart, cartSubtotal, clearCart } = useShop();

  const shipping = cartSubtotal === 0 || cartSubtotal >= 2999 ? 0 : 149;
  const total = cartSubtotal + shipping;

  return (
    <SiteLayout>
      <PageHeader eyebrow="Checkout" title="Your Shopping Bag" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {cart.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-2xl font-semibold">Your bag is empty</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              Explore our sarees, lehengas and kurtis to find something you'll love.
            </p>
            <Link
              to="/shop"
              search={{ q: "", category: "All", sort: "featured" }}
              className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {cart.map((line) => {
                const p = getProduct(line.productId);
                if (!p) return null;
                return (
                  <div
                    key={line.key}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <Link
                      to="/product/$productId"
                      params={{ productId: p.id }}
                      className="h-28 w-24 shrink-0 overflow-hidden rounded-md bg-cream sm:h-32 sm:w-28"
                    >
                      <img
                        src={productImages[p.imageKey]}
                        alt={p.name}
                        loading="lazy"
                        width={800}
                        height={1000}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        to="/product/$productId"
                        params={{ productId: p.id }}
                        className="text-sm font-semibold hover:text-primary sm:text-base"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p.category} · Size {line.size}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-primary">{inr(p.price)}</p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(line.key, line.qty - 1)}
                            className="px-3 py-1.5"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">{line.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(line.key, line.qty + 1)}
                            className="px-3 py-1.5"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(line.key)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={clearCart}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-destructive"
              >
                Clear bag
              </button>
            </div>

            <aside className="h-fit rounded-xl border border-border bg-cream p-6">
              <h2 className="text-xl font-semibold">Order summary</h2>
              <div className="gold-rule my-4" />
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">{inr(cartSubtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium">{shipping === 0 ? "Free" : inr(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-semibold text-primary">{inr(total)}</dd>
                </div>
              </dl>
              {shipping > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Add {inr(2999 - cartSubtotal)} more for free shipping.
                </p>
              )}
              <Link
                to="/checkout"
                className="mt-6 block rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                Proceed to checkout
              </Link>
              <Link
                to="/shop"
                search={{ q: "", category: "All", sort: "featured" }}
                className="mt-3 block text-center text-sm text-primary underline underline-offset-4"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
