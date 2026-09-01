import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { useShop } from "@/store/shop";
import { formatDate, inr } from "@/lib/format";
import { SearchIcon } from "@/components/Icons";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Radhika Collection Admin" },
      { name: "description", content: "Customer directory with orders and lifetime spend." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Customers — Admin" },
      { property: "og:description", content: "Customer directory for the demo storefront." },
    ],
  }),
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const { customers, orders } = useShop();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("spent");

  const list = useMemo(() => {
    const t = query.trim().toLowerCase();
    const filtered = customers.filter(
      (c) =>
        !t ||
        c.name.toLowerCase().includes(t) ||
        c.city.toLowerCase().includes(t) ||
        c.phone.includes(t) ||
        c.email.toLowerCase().includes(t),
    );
    const sorted = [...filtered];
    if (sort === "spent") sorted.sort((a, b) => b.spent - a.spent);
    else if (sort === "orders") sorted.sort((a, b) => b.orders - a.orders);
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => b.joined.localeCompare(a.joined));
    return sorted;
  }, [customers, query, sort]);

  const totalSpend = customers.reduce((s, c) => s + c.spent, 0);
  const avgOrder =
    orders.length > 0
      ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length)
      : 0;

  return (
    <AdminLayout title="Customers" subtitle="Everyone who has shopped with Radhika Collection.">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total customers</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{customers.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Lifetime spend</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{inr(totalSpend)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Average order value</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{inr(avgOrder)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center rounded-md border border-border bg-card px-3 py-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, city, phone or email"
            aria-label="Search customers"
            className="w-full bg-transparent px-2 text-sm outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort customers"
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="spent">Top spenders</option>
          <option value="orders">Most orders</option>
          <option value="name">Name A–Z</option>
          <option value="joined">Recently joined</option>
        </select>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No customers match this search.</p>
      ) : (
        <>
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Spend</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {list.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.id}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p>{c.phone}</p>
                      <p className="text-xs">{c.email}</p>
                    </td>
                    <td className="px-4 py-3">{c.city}</td>
                    <td className="px-4 py-3">{c.orders}</td>
                    <td className="px-4 py-3 font-medium">{inr(c.spent)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(c.joined)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {list.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm font-semibold text-primary">{inr(c.spent)}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.city} · {c.phone}
                </p>
                <p className="text-xs text-muted-foreground">{c.email}</p>
                <p className="mt-2 text-xs">
                  {c.orders} orders · joined {formatDate(c.joined)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
