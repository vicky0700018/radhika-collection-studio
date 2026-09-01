import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { useShop } from "@/store/shop";
import { formatDate, inr } from "@/lib/format";
import { categories } from "@/data/products";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Radhika Collection" },
      { name: "description", content: "Sales, orders and inventory overview for Radhika Collection." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — Radhika Collection" },
      { property: "og:description", content: "Store performance at a glance." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { products, orders, customers } = useShop();

  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pending").length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 6);
  const outOfStock = products.filter((p) => p.stock === 0);

  const stats = [
    { label: "Total revenue", value: inr(revenue), note: `${orders.length} orders` },
    { label: "Pending orders", value: String(pending), note: "Needs action" },
    { label: "Products live", value: String(products.length), note: `${categories.length} categories` },
    { label: "Customers", value: String(customers.length), note: "Registered buyers" },
  ];

  const byCategory = categories.map((c) => ({
    category: c,
    count: products.filter((p) => p.category === c).length,
    stock: products.filter((p) => p.category === c).reduce((s, p) => s + p.stock, 0),
  }));
  const maxCount = Math.max(1, ...byCategory.map((b) => b.count));

  return (
    <AdminLayout title="Dashboard" subtitle="Live view of the demo storefront's performance.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary underline underline-offset-4">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border text-sm">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.id} · {formatDate(o.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{inr(o.total)}</p>
                  <p className="text-xs text-muted-foreground">{o.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Catalogue by category</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {byCategory.map((b) => (
              <li key={b.category}>
                <div className="flex justify-between">
                  <span>{b.category}</span>
                  <span className="text-muted-foreground">
                    {b.count} styles · {b.stock} units
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(b.count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Inventory alerts</h2>
        {lowStock.length === 0 && outOfStock.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">All products are comfortably stocked.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {outOfStock.map((p) => (
              <li key={p.id} className="flex justify-between gap-3 rounded-md bg-secondary px-4 py-2">
                <span className="truncate">{p.name}</span>
                <span className="shrink-0 font-medium text-destructive">Out of stock</span>
              </li>
            ))}
            {lowStock.map((p) => (
              <li key={p.id} className="flex justify-between gap-3 rounded-md bg-secondary px-4 py-2">
                <span className="truncate">{p.name}</span>
                <span className="shrink-0 font-medium">{p.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminLayout>
  );
}
