import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { business } from "@/data/mock";
import { categories } from "@/data/products";
import { useShop } from "@/store/shop";
import { CartIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/Icons";

export function Header() {
  const { cartCount, wishlist } = useShop();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/shop", search: { q: query.trim(), category: "All", sort: "featured" } });
  }

  const navLink =
    "text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-primary";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[11px] tracking-[0.14em] uppercase sm:text-xs">
          Free shipping across India on orders above ₹2,999 · Call {business.phone}
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <MenuIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        <Link to="/" className="mr-auto flex flex-col leading-none">
          <span className="font-display text-xl font-semibold text-primary sm:text-2xl">
            Radhika Collection
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.28em] text-gold sm:block">
            Ethnic Couture
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link to="/" className={navLink} activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link
            to="/shop"
            search={{ q: "", category: "All", sort: "featured" }}
            className={navLink}
            activeProps={{ className: "text-primary" }}
          >
            Shop
          </Link>
          <div className="group relative">
            <button type="button" className={navLink}>Categories</button>
            <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <ul className="rounded-lg border border-border bg-popover p-2 shadow-xl">
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      to="/shop"
                      search={{ q: "", category: c, sort: "featured" }}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-secondary hover:text-primary"
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link to="/about" className={navLink} activeProps={{ className: "text-primary" }}>About</Link>
          <Link to="/contact" className={navLink} activeProps={{ className: "text-primary" }}>Contact</Link>
        </nav>

        <form onSubmit={submitSearch} className="ml-4 hidden items-center md:flex">
          <label className="sr-only" htmlFor="site-search">Search products</label>
          <div className="flex items-center rounded-full border border-border bg-card px-3 py-1.5">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, lehengas…"
              className="w-36 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground lg:w-48"
            />
          </div>
        </form>

        <Link to="/wishlist" className="relative ml-2 p-2 text-foreground/80 hover:text-primary" aria-label="Wishlist">
          <HeartIcon />
          {wishlist.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
              {wishlist.length}
            </span>
          )}
        </Link>
        <Link to="/cart" className="relative p-2 text-foreground/80 hover:text-primary" aria-label="Shopping bag">
          <CartIcon />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="space-y-4 px-4 py-4">
            <form onSubmit={submitSearch} className="flex items-center rounded-full border border-border bg-card px-3 py-2">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full bg-transparent px-2 text-sm outline-none"
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <CloseIcon className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>
            <nav className="grid gap-1 text-sm">
              <Link to="/" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">Home</Link>
              <Link to="/shop" search={{ q: "", category: "All", sort: "featured" }} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">Shop All</Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  to="/shop"
                  search={{ q: "", category: c, sort: "featured" }}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 pl-6 text-muted-foreground hover:bg-secondary hover:text-primary"
                >
                  {c}
                </Link>
              ))}
              <Link to="/about" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">About</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">Contact</Link>
              <Link to="/admin/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-secondary">Admin Login</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
