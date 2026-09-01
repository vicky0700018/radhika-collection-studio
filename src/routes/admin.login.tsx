import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ADMIN_CREDENTIALS, useShop } from "@/store/shop";
import { business } from "@/data/mock";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Radhika Collection" },
      { name: "description", content: "Sign in to the Radhika Collection store admin panel." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — Radhika Collection" },
      { property: "og:description", content: "Store management sign-in." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { login, isAdmin } = useShop();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }
    if (login(username, password)) {
      setError("");
      navigate({ to: "/admin/dashboard" });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  }

  const inputCls =
    "mt-1 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl font-semibold text-primary">
            {business.name}
          </Link>
          <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-gold">Admin Panel</p>
        </div>

        <form onSubmit={submit} noValidate className="mt-8 rounded-xl border border-border bg-card p-7">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage products, orders and customers.
          </p>

          {isAdmin && (
            <p className="mt-4 rounded-md border border-border bg-secondary px-4 py-3 text-sm">
              You're already signed in.{" "}
              <Link to="/admin/dashboard" className="font-medium text-primary underline underline-offset-4">
                Open dashboard
              </Link>
            </p>
          )}

          <label className="mt-5 block text-sm">
            Username
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className={inputCls}
              placeholder="admin"
              autoComplete="username"
            />
          </label>

          <label className="mt-4 block text-sm">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={inputCls}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Sign in
          </button>

          <p className="mt-5 rounded-md bg-secondary px-4 py-3 text-xs text-muted-foreground">
            Demo credentials — username <strong>{ADMIN_CREDENTIALS.username}</strong>, password{" "}
            <strong>{ADMIN_CREDENTIALS.password}</strong>
          </p>
        </form>

        <Link to="/" className="mt-6 block text-center text-sm text-primary underline underline-offset-4">
          Back to storefront
        </Link>
      </div>
    </div>
  );
}
