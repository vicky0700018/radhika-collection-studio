import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedProducts, type Product } from "@/data/products";
import {
  seedCustomers,
  seedOrders,
  type Customer,
  type Order,
  type OrderStatus,
} from "@/data/mock";

export type CartLine = {
  key: string;
  productId: string;
  size: string;
  qty: number;
};

export type Toast = { id: number; message: string };

type ShopValue = {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  cart: CartLine[];
  wishlist: string[];
  isAdmin: boolean;
  toasts: Toast[];
  notify: (message: string) => void;
  dismissToast: (id: number) => void;
  getProduct: (id: string) => Product | undefined;
  addToCart: (productId: string, size: string, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  toggleWishlist: (productId: string) => void;
  inWishlist: (productId: string) => boolean;
  placeOrder: (details: {
    name: string;
    phone: string;
    city: string;
    payment: Order["payment"];
  }) => Order;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
};

const ShopContext = createContext<ShopValue | null>(null);

export const ADMIN_CREDENTIALS = { username: "admin", password: "radhika123" };

const STORAGE_KEY = "radhika-collection-session";

type Persisted = {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  cart: CartLine[];
  wishlist: string[];
  isAdmin: boolean;
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore the in-memory session after hydration so a refresh keeps the
  // shopper's bag, wishlist and any admin edits for this browser session.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Persisted>;
        if (Array.isArray(saved.products) && saved.products.length > 0) setProducts(saved.products);
        if (Array.isArray(saved.orders)) setOrders(saved.orders);
        if (Array.isArray(saved.customers)) setCustomers(saved.customers);
        if (Array.isArray(saved.cart)) setCart(saved.cart);
        if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist);
        if (typeof saved.isAdmin === "boolean") setIsAdmin(saved.isAdmin);
      }
    } catch {
      /* ignore malformed session data */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ products, orders, customers, cart, wishlist, isAdmin }),
      );
    } catch {
      /* storage unavailable — state stays in memory only */
    }
  }, [hydrated, products, orders, customers, cart, wishlist, isAdmin]);


  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );

  const addToCart = useCallback(
    (productId: string, size: string, qty = 1) => {
      const key = `${productId}__${size}`;
      setCart((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
        }
        return [...prev, { key, productId, size, qty }];
      });
      notify("Added to bag");
    },
    [notify],
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 10) } : l)),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const cartSubtotal = cart.reduce((sum, l) => {
    const p = products.find((x) => x.id === l.productId);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) {
          notify("Removed from wishlist");
          return prev.filter((id) => id !== productId);
        }
        notify("Saved to wishlist");
        return [...prev, productId];
      });
    },
    [notify],
  );

  const inWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const placeOrder = useCallback<ShopValue["placeOrder"]>(
    (details) => {
      const items = cart.map((l) => {
        const p = products.find((x) => x.id === l.productId);
        return {
          productId: l.productId,
          name: p?.name ?? l.productId,
          qty: l.qty,
          price: p?.price ?? 0,
          size: l.size,
        };
      });
      const total = items.reduce((s, i) => s + i.price * i.qty, 0);
      const order: Order = {
        id: "ORD-" + Math.floor(10000 + Math.random() * 89999),
        customer: details.name,
        phone: details.phone,
        city: details.city,
        date: new Date().toISOString().slice(0, 10),
        items,
        total,
        payment: details.payment,
        status: "Pending",
      };
      setOrders((prev) => [order, ...prev]);
      setCustomers((prev) => {
        const existing = prev.find(
          (c) => c.name.toLowerCase() === details.name.trim().toLowerCase(),
        );
        if (existing) {
          return prev.map((c) =>
            c.id === existing.id
              ? { ...c, orders: c.orders + 1, spent: c.spent + total }
              : c,
          );
        }
        return [
          {
            id: "CUS-" + Math.floor(200 + Math.random() * 799),
            name: details.name,
            phone: details.phone,
            email: "-",
            city: details.city,
            orders: 1,
            spent: total,
            joined: new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ];
      });
      setCart([]);
      return order;
    },
    [cart, products],
  );

  const login = useCallback((username: string, password: string) => {
    const ok =
      username.trim() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password;
    if (ok) setIsAdmin(true);
    return ok;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const saveProduct = useCallback(
    (product: Product) => {
      setProducts((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        return exists
          ? prev.map((p) => (p.id === product.id ? product : p))
          : [product, ...prev];
      });
      notify("Product saved");
    },
    [notify],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((l) => l.productId !== id));
      setWishlist((prev) => prev.filter((w) => w !== id));
      notify("Product deleted");
    },
    [notify],
  );

  const setOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      notify(`Order ${id} marked ${status}`);
    },
    [notify],
  );

  const value = useMemo<ShopValue>(
    () => ({
      products,
      orders,
      customers,
      cart,
      wishlist,
      isAdmin,
      toasts,
      notify,
      dismissToast,
      getProduct,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotal,
      toggleWishlist,
      inWishlist,
      placeOrder,
      login,
      logout,
      saveProduct,
      deleteProduct,
      setOrderStatus,
    }),
    [
      products,
      orders,
      customers,
      cart,
      wishlist,
      isAdmin,
      toasts,
      notify,
      dismissToast,
      getProduct,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotal,
      toggleWishlist,
      inWishlist,
      placeOrder,
      login,
      logout,
      saveProduct,
      deleteProduct,
      setOrderStatus,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
