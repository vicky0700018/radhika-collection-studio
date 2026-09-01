import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { useShop } from "@/store/shop";
import { inr } from "@/lib/format";
import type { Order } from "@/data/mock";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Radhika Collection" },
      { name: "description", content: "Complete your demo order with delivery details and a payment method." },
      { property: "og:title", content: "Checkout — Radhika Collection" },
      { property: "og:description", content: "Secure demo checkout for your ethnic wear order." },
    ],
  }),
  component: CheckoutPage,
});

type Fields = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  payment: Order["payment"];
};

const initial: Fields = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  payment: "Cash on Delivery",
};

function CheckoutPage() {
  const { cart, getProduct, cartSubtotal, placeOrder, notify } = useShop();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const shipping = cartSubtotal >= 2999 || cartSubtotal === 0 ? 0 : 149;
  const total = cartSubtotal + shipping;

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (fields.name.trim().length < 3) next.name = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(fields.phone.replace(/\s/g, "")))
      next.phone = "Enter a valid 10-digit Indian mobile number.";
    if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email))
      next.email = "Enter a valid email address.";
    if (fields.address.trim().length < 10) next.address = "Please enter a complete address.";
    if (fields.city.trim().length < 2) next.city = "Please enter your city.";
    if (!/^\d{6}$/.test(fields.pincode)) next.pincode = "PIN code must be 6 digits.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!validate()) {
      notify("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    const order = placeOrder({
      name: fields.name.trim(),
      phone: fields.phone.trim(),
      city: fields.city.trim(),
      payment: fields.payment,
    });
    navigate({ to: "/order-success", search: { orderId: order.id } });
  }

  const inputCls =
    "mt-1 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";

  if (cart.length === 0) {
    return (
      <SiteLayout>
        <PageHeader eyebrow="Checkout" title="Nothing to check out" />
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Your bag is empty. Add a few pieces and come back to complete your order.
          </p>
          <Link
            to="/shop"
            search={{ q: "", category: "All", sort: "featured" }}
            className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Browse products
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Almost there"
        title="Checkout"
        subtitle="This is a demo store — no payment is actually processed."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">Delivery details</h2>
              <div className="gold-rule my-4" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm sm:col-span-2">
                  Full name*
                  <input value={fields.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Ananya Deshmukh" />
                  {errors.name && <span className="mt-1 block text-xs text-destructive">{errors.name}</span>}
                </label>
                <label className="text-sm">
                  Mobile number*
                  <input value={fields.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="98765 43210" inputMode="numeric" />
                  {errors.phone && <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>}
                </label>
                <label className="text-sm">
                  Email (optional)
                  <input value={fields.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="you@example.in" />
                  {errors.email && <span className="mt-1 block text-xs text-destructive">{errors.email}</span>}
                </label>
                <label className="text-sm sm:col-span-2">
                  Address*
                  <textarea value={fields.address} onChange={(e) => set("address", e.target.value)} rows={3} className={inputCls} placeholder="Flat / House no., street, landmark" />
                  {errors.address && <span className="mt-1 block text-xs text-destructive">{errors.address}</span>}
                </label>
                <label className="text-sm">
                  City*
                  <input value={fields.city} onChange={(e) => set("city", e.target.value)} className={inputCls} placeholder="Pune" />
                  {errors.city && <span className="mt-1 block text-xs text-destructive">{errors.city}</span>}
                </label>
                <label className="text-sm">
                  PIN code*
                  <input value={fields.pincode} onChange={(e) => set("pincode", e.target.value)} className={inputCls} placeholder="411030" inputMode="numeric" />
                  {errors.pincode && <span className="mt-1 block text-xs text-destructive">{errors.pincode}</span>}
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">Payment method</h2>
              <div className="gold-rule my-4" />
              <div className="space-y-3">
                {(["Cash on Delivery", "UPI (Demo)", "Card (Demo)"] as const).map((m) => (
                  <label
                    key={m}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm ${
                      fields.payment === m ? "border-primary bg-secondary" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={fields.payment === m}
                      onChange={() => set("payment", m)}
                      className="h-4 w-4 accent-[oklch(0.36_0.13_15)]"
                    />
                    <span className="font-medium">{m}</span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Demo only — no card details are collected and no money is charged.
              </p>
            </section>
          </div>

          <aside className="h-fit rounded-xl border border-border bg-cream p-6">
            <h2 className="text-xl font-semibold">Your order</h2>
            <div className="gold-rule my-4" />
            <ul className="space-y-3 text-sm">
              {cart.map((l) => {
                const p = getProduct(l.productId);
                if (!p) return null;
                return (
                  <li key={l.key} className="flex justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {l.size} × {l.qty}
                      </span>
                    </span>
                    <span className="shrink-0 font-medium">{inr(p.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{inr(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : inr(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd className="text-primary">{inr(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>
            <Link to="/cart" className="mt-3 block text-center text-sm text-primary underline underline-offset-4">
              Back to bag
            </Link>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}
