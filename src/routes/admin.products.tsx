import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { useShop } from "@/store/shop";
import {
  categories,
  productImages,
  type Category,
  type ImageKey,
  type Product,
} from "@/data/products";
import { inr } from "@/lib/format";
import { CloseIcon, SearchIcon, TrashIcon } from "@/components/Icons";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Manage Products — Radhika Collection Admin" },
      { name: "description", content: "Add, edit and remove products in the Radhika Collection catalogue." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Manage Products — Admin" },
      { property: "og:description", content: "Catalogue management for the demo storefront." },
    ],
  }),
  component: AdminProductsPage,
});

const imageKeys = Object.keys(productImages) as ImageKey[];

type ProductErrors = {
  name?: string;
  price?: string;
  mrp?: string;
  stock?: string;
  description?: string;
};

const emptyDraft = (): Product => ({
  id: "",
  name: "",
  category: "Sarees",
  price: 0,
  mrp: 0,
  imageKey: "sareeMaroon",
  description: "",
  fabric: "",
  work: "",
  colors: [],
  sizes: ["Free Size"],
  stock: 0,
  rating: 4.5,
  reviews: 0,
  featured: false,
});

function AdminProductsPage() {
  const { products, saveProduct, deleteProduct } = useShop();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [draft, setDraft] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<ProductErrors>({});

  const list = useMemo(() => {
    const t = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (filter === "All" || p.category === filter) &&
        (!t || p.name.toLowerCase().includes(t) || p.id.toLowerCase().includes(t)),
    );
  }, [products, query, filter]);

  function openNew() {
    const next = emptyDraft();
    next.id = "RC-" + Math.floor(7000 + Math.random() * 2999);
    setDraft(next);
    setIsNew(true);
    setErrors({});
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const next: ProductErrors = {};
    if (draft.name.trim().length < 4) next.name = "Product name is too short.";
    if (draft.price <= 0) next.price = "Price must be greater than zero.";
    if (draft.mrp < draft.price) next.mrp = "MRP cannot be lower than the selling price.";
    if (draft.stock < 0) next.stock = "Stock cannot be negative.";
    if (draft.description.trim().length < 20) next.description = "Add at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    saveProduct({ ...draft, name: draft.name.trim() });
    setDraft(null);
  }

  const inputCls =
    "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <AdminLayout
      title="Products"
      subtitle="Changes here update the public storefront instantly during this session."
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center rounded-md border border-border bg-card px-3 py-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or SKU"
            aria-label="Search products"
            className="w-full bg-transparent px-2 text-sm outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          aria-label="Filter by category"
        >
          {["All", ...categories].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={openNew}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          + Add product
        </button>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No products match this search.
        </p>
      ) : (
        <>
          {/* Table (md+) */}
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {list.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={productImages[p.imageKey]}
                          alt={p.name}
                          loading="lazy"
                          width={800}
                          height={1000}
                          className="h-12 w-10 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3">{inr(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={p.stock === 0 ? "text-destructive" : ""}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({ ...p });
                            setIsNew(false);
                            setErrors({});
                          }}
                          className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(p.id)}
                          className="rounded-md border border-border px-3 py-1.5 text-xs text-destructive hover:border-destructive"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <div className="mt-6 space-y-3 md:hidden">
            {list.map((p) => (
              <div key={p.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                <img
                  src={productImages[p.imageKey]}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-24 w-20 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.id} · {p.category}</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{inr(p.price)}</p>
                  <p className="text-xs text-muted-foreground">Stock: {p.stock}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDraft({ ...p });
                        setIsNew(false);
                        setErrors({});
                      }}
                      className="rounded-md border border-border px-3 py-1.5 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(p.id)}
                      className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-destructive"
                    >
                      <TrashIcon className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Editor */}
      {draft && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-4">
          <form
            onSubmit={submit}
            noValidate
            className="mx-auto my-6 w-full max-w-2xl rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{isNew ? "Add product" : "Edit product"}</h2>
                <p className="text-xs text-muted-foreground">SKU {draft.id}</p>
              </div>
              <button type="button" onClick={() => setDraft(null)} aria-label="Close editor">
                <CloseIcon />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">
                Product name
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} />
                {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
              </label>

              <label className="text-sm">
                Category
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}
                  className={inputCls}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                Image
                <select
                  value={draft.imageKey}
                  onChange={(e) => setDraft({ ...draft, imageKey: e.target.value as ImageKey })}
                  className={inputCls}
                >
                  {imageKeys.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                Selling price (₹)
                <input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} className={inputCls} />
                {errors.price && <span className="text-xs text-destructive">{errors.price}</span>}
              </label>

              <label className="text-sm">
                MRP (₹)
                <input type="number" value={draft.mrp} onChange={(e) => setDraft({ ...draft, mrp: Number(e.target.value) })} className={inputCls} />
                {errors.mrp && <span className="text-xs text-destructive">{errors.mrp}</span>}
              </label>

              <label className="text-sm">
                Stock
                <input type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} className={inputCls} />
                {errors.stock && <span className="text-xs text-destructive">{errors.stock}</span>}
              </label>

              <label className="text-sm">
                Fabric
                <input value={draft.fabric} onChange={(e) => setDraft({ ...draft, fabric: e.target.value })} className={inputCls} />
              </label>

              <label className="text-sm">
                Work / craft
                <input value={draft.work} onChange={(e) => setDraft({ ...draft, work: e.target.value })} className={inputCls} />
              </label>

              <label className="text-sm">
                Colours (comma separated)
                <input
                  value={draft.colors.join(", ")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                    })
                  }
                  className={inputCls}
                />
              </label>

              <label className="text-sm">
                Sizes (comma separated)
                <input
                  value={draft.sizes.join(", ")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className={inputCls}
                />
              </label>

              <label className="text-sm sm:col-span-2">
                Description
                <textarea rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} />
                {errors.description && <span className="text-xs text-destructive">{errors.description}</span>}
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                  className="h-4 w-4 accent-[oklch(0.36_0.13_15)]"
                />
                Show in featured section
              </label>

              <label className="text-sm">
                Badge
                <select
                  value={draft.tag ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      tag: (e.target.value || undefined) as Product["tag"],
                    })
                  }
                  className={inputCls}
                >
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Limited">Limited</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setDraft(null)} className="rounded-md border border-border px-5 py-2.5 text-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                {isNew ? "Create product" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center">
            <h2 className="text-lg font-semibold">Delete this product?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              It will be removed from the storefront, carts and wishlists.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => setConfirmId(null)} className="rounded-md border border-border px-5 py-2.5 text-sm">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(confirmId);
                  setConfirmId(null);
                }}
                className="rounded-md bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
