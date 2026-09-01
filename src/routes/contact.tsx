import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { business } from "@/data/mock";
import { useShop } from "@/store/shop";
import { CheckIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Radhika Collection — Pune Ethnic Wear Store" },
      {
        name: "description",
        content:
          "Call, email or visit Radhika Collection on Laxmi Road, Pune. Styling appointments and bulk wedding orders welcome.",
      },
      { property: "og:title", content: "Contact Radhika Collection" },
      {
        property: "og:description",
        content: "Store address, phone, email and enquiry form.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { notify } = useShop();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});

  const inputCls =
    "mt-1 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: { name?: string; phone?: string; message?: string } = {};
    if (form.name.trim().length < 3) next.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      next.phone = "Enter a valid 10-digit mobile number.";
    if (form.message.trim().length < 10) next.message = "Tell us a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
    notify("Enquiry sent — we'll call you back");
    setForm({ name: "", phone: "", message: "" });
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="We'd love to hear from you"
        title="Contact Us"
        subtitle="Questions about sizing, custom stitching or bulk wedding orders? Reach out."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Store details</h2>
            <div className="gold-rule my-4" />
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>{business.address}</span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>
                  <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                    {business.phone}
                  </a>
                  <span className="block text-xs text-muted-foreground">
                    WhatsApp: {business.whatsapp}
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <a href={`mailto:${business.email}`} className="hover:text-primary">
                  {business.email}
                </a>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>{business.hours}</span>
              </li>
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">
              Owner: {business.owner} · GSTIN {business.gst}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-cream p-6">
            <h3 className="text-lg font-semibold">Styling appointments</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Bridal and trousseau consultations are available on weekdays between 11 AM and
              6 PM. Call ahead so we can keep the pieces you like ready to try.
            </p>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Send an enquiry</h2>
          <div className="gold-rule my-4" />

          {sent && (
            <p className="mb-4 flex items-center gap-2 rounded-md border border-border bg-secondary px-4 py-3 text-sm">
              <CheckIcon className="h-4 w-4 text-primary" />
              Thanks! Your message has been recorded (demo only).
            </p>
          )}

          <label className="block text-sm">
            Your name*
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="Ananya Deshmukh"
            />
            {errors.name && <span className="mt-1 block text-xs text-destructive">{errors.name}</span>}
          </label>

          <label className="mt-4 block text-sm">
            Mobile number*
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputCls}
              placeholder="98765 43210"
              inputMode="numeric"
            />
            {errors.phone && <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>}
          </label>

          <label className="mt-4 block text-sm">
            Message*
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className={inputCls}
              placeholder="I'm looking for a maroon Banarasi saree for a December wedding…"
            />
            {errors.message && <span className="mt-1 block text-xs text-destructive">{errors.message}</span>}
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Send enquiry
          </button>
        </form>
      </div>
    </SiteLayout>
  );
}
