import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useShop } from "@/store/shop";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
] as const;

export function AdminLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { isAdmin, logout } = useShop();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-semibold">Session required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Please sign in to the admin panel to view this page. Admin sessions last for the
            current browser session only.
          </p>
          <Link
            to="/admin/login"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Go to admin login
          </Link>
          <Link to="/" className="mt-4 block text-sm text-primary underline underline-offset-4">
            Back to storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/admin/dashboard" className="font-display text-lg font-semibold sm:text-xl">
            Radhika Admin
          </Link>
          <nav className="no-scrollbar ml-auto flex items-center gap-1 overflow-x-auto">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-primary-foreground/80 hover:bg-white/10"
                activeProps={{ className: "bg-white/15 text-primary-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden rounded-md border border-primary-foreground/30 px-3 py-2 text-xs sm:block"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate({ to: "/admin/login" });
              }}
              className="rounded-md bg-gold px-3 py-2 text-xs font-medium text-gold-foreground"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="gold-rule my-6" />
        {children}
      </div>
    </div>
  );
}
