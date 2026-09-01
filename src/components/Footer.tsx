import { Link } from "@tanstack/react-router";
import { business } from "@/data/mock";
import { categories } from "@/data/products";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold text-primary">{business.name}</p>
          <div className="gold-rule my-3 w-24" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {business.tagline}. Handpicked sarees, lehengas and suit sets crafted by Indian
            artisans since {business.established}.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">GSTIN: {business.gst}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em]">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  to="/shop"
                  search={{ category: c, q: "", sort: "featured" }}
                  className="hover:text-primary"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em]">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/shop" search={{ q: "", category: "All", sort: "featured" }} className="hover:text-primary">All Products</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Shopping Bag</Link></li>
            <li>
              <Link to="/admin/login" className="hover:text-primary">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em]">Visit the store</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{business.address}</span>
            </li>
            <li className="flex gap-2">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                {business.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${business.email}`} className="hover:text-primary">
                {business.email}
              </a>
            </li>
            <li className="flex gap-2">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{business.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p>Demo storefront — no real payments are processed.</p>
        </div>
      </div>
    </footer>
  );
}
