import { Link } from "@tanstack/react-router";
import { productImages, type Product } from "@/data/products";
import { discountPct, inr } from "@/lib/format";
import { useShop } from "@/store/shop";
import { HeartIcon, StarIcon } from "@/components/Icons";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, inWishlist, addToCart } = useShop();
  const off = discountPct(product.price, product.mrp);
  const saved = inWishlist(product.id);

  return (
    <article className="card-lift group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-[4/5] overflow-hidden bg-cream"
      >
        <img
          src={productImages[product.imageKey]}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            {product.tag}
          </span>
        )}
        {off > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold text-gold-foreground">
            {off}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/75 py-2 text-center text-xs font-medium tracking-wide text-background">
            Out of stock
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={saved}
        className={`absolute right-3 top-12 grid h-9 w-9 place-items-center rounded-full border border-border bg-card/90 backdrop-blur transition-colors ${
          saved ? "text-primary" : "text-muted-foreground hover:text-primary"
        }`}
      >
        <HeartIcon className="h-4 w-4" filled={saved} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-base leading-snug font-semibold">
          <Link to="/product/$productId" params={{ productId: product.id }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1 text-gold">
          <StarIcon className="h-3.5 w-3.5" />
          <span className="text-xs font-medium text-foreground">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-1">
          <span className="text-lg font-semibold text-primary">{inr(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
          )}
        </div>
        <button
          type="button"
          disabled={product.stock === 0}
          onClick={() => addToCart(product.id, product.sizes[0] ?? "Free Size")}
          className="mt-2 w-full rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent"
        >
          {product.stock === 0 ? "Sold out" : "Add to bag"}
        </button>
      </div>
    </article>
  );
}
