import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useShop } from "@/store/shop";
import { business } from "@/data/mock";
import { formatDate, inr } from "@/lib/format";
import { CheckIcon } from "@/components/Icons";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search.orderId === "string" ? search.orderId : "",
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Radhika Collection" },
      { name: "description", content: "Your demo order has been placed with Radhika Collection." },
      { property: "og:title", content: "Order Confirmed — Radhika Collection" },
      { property: "og:description", content: "Thank you for shopping with Radhika Collection." },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { orderId } = Route.useSearch();
  const { orders } = useShop();
  const order = orders.find((o) => o.id === orderId);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-primary">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Thank you for your order!</h1>
          <div className="gold-rule mx-auto mt-4 w-28" />

          {order ? (
            <>
              <p className="mt-4 text-sm text-muted-foreground">
                Order <span className="font-semibold text-foreground">{order.id}</span> placed on{" "}
                {formatDate(order.date)}. Our team will call {order.phone} to confirm.
              </p>

              <ul className="mx-auto mt-8 max-w-md space-y-3 text-left text-sm">
                {order.items.map((i) => (
                  <li key={i.productId + i.size} className="flex justify-between gap-3 border-b border-border pb-3">
                    <span>
                      <span className="block font-medium">{i.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {i.size} × {i.qty}
                      </span>
                    </span>
                    <span className="shrink-0 font-medium">{inr(i.price * i.qty)}</span>
                  </li>
                ))}
                <li className="flex justify-between pt-1 text-base font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{inr(order.total)}</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">Payment: {order.payment}</p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Your order has been recorded. For any help, call us at {business.phone}.
            </p>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/shop"
              search={{ q: "", category: "All", sort: "featured" }}
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Continue shopping
            </Link>
            <Link to="/" className="rounded-md border border-border px-6 py-3 text-sm font-medium">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
