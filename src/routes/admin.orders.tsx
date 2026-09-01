import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { useShop } from "@/store/shop";
import { orderStatuses, type Order, type OrderStatus } from "@/data/mock";
import { formatDate, inr } from "@/lib/format";
import { CloseIcon, SearchIcon } from "@/components/Icons";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Manage Orders — Radhika Collection Admin" },
      { name: "description", content: "Track and update the status of customer orders." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Manage Orders — Admin" },
      { property: "og:description", content: "Order tracking for the demo storefront." },
    ],
  }),
  component: AdminOrdersPage,
});

const statusStyle: Record<OrderStatus, string> = {
  Pending: "bg-warning/20 text-warning",
  Processing: "bg-gold/25 text-gold-foreground",
  Shipped: "bg-secondary text-secondary-foreground",
  Delivered: "bg-success/20 text-success",
  Cancelled: "bg-destructive/15 text-destructive",
};

function AdminOrdersPage() {
  const { orders, setOrderStatus } = useShop();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [detail, setDetail] = useState<Order | null>(null);

  const list = useMemo(() => {
    const t = query.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (status === "All" || o.status === status) &&
        (!t ||
          o.id.toLowerCase().includes(t) ||
          o.customer.toLowerCase().includes(t) ||
          o.phone.includes(t)),
    );
  }, [orders, query, status]);

  return (
    <AdminLayout title="Orders" subtitle="Update fulfilment status as orders move through the pipeline.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {orderStatuses.map((s) => (
          <div key={s} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s}</p>
            <p className="mt-1 text-xl font-semibold text-primary">
              {orders.filter((o) => o.status === s).length}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center rounded-md border border-border bg-card px-3 py-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID, customer or phone"
            aria-label="Search orders"
            className="w-full bg-transparent px-2 text-sm outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
        >
          {["All", ...orderStatuses].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No orders match this filter.</p>
      ) : (
        <>
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {list.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-medium">{o.id}</td>
                    <td className="px-4 py-3">
                      <p>{o.customer}</p>
                      <p className="text-xs text-muted-foreground">{o.city} · {o.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(o.date)}</td>
                    <td className="px-4 py-3">{inr(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}
                          aria-label={`Update status for ${o.id}`}
                          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
                        >
                          {orderStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setDetail(o)}
                          className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {list.map((o) => (
              <div key={o.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{o.id}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[o.status]}`}>
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 text-sm">{o.customer}</p>
                <p className="text-xs text-muted-foreground">
                  {o.city} · {formatDate(o.date)} · {inr(o.total)}
                </p>
                <div className="mt-3 flex gap-2">
                  <select
                    value={o.status}
                    onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}
                    aria-label={`Update status for ${o.id}`}
                    className="flex-1 rounded-md border border-border bg-background px-2 py-2 text-xs"
                  >
                    {orderStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setDetail(o)}
                    className="rounded-md border border-border px-3 py-2 text-xs"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-4">
          <div className="mx-auto my-8 w-full max-w-lg rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{detail.id}</h2>
                <p className="text-xs text-muted-foreground">{formatDate(detail.date)}</p>
              </div>
              <button type="button" onClick={() => setDetail(null)} aria-label="Close order details">
                <CloseIcon />
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Customer</dt><dd className="font-medium">{detail.customer}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Phone</dt><dd className="font-medium">{detail.phone}</dd></div>
              <div><dt className="text-xs text-muted-foreground">City</dt><dd className="font-medium">{detail.city}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Payment</dt><dd className="font-medium">{detail.payment}</dd></div>
            </dl>

            <ul className="mt-5 divide-y divide-border text-sm">
              {detail.items.map((i) => (
                <li key={i.productId + i.size} className="flex justify-between gap-3 py-3">
                  <span>
                    <span className="block font-medium">{i.name}</span>
                    <span className="text-xs text-muted-foreground">{i.size} × {i.qty}</span>
                  </span>
                  <span className="shrink-0">{inr(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-primary">{inr(detail.total)}</span>
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {orderStatuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setOrderStatus(detail.id, s);
                    setDetail({ ...detail, status: s });
                  }}
                  className={`rounded-full border px-4 py-1.5 text-xs ${
                    detail.status === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
