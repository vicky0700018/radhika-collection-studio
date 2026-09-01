export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
  size: string;
};

export type Order = {
  id: string;
  customer: string;
  phone: string;
  city: string;
  date: string;
  items: OrderItem[];
  total: number;
  payment: "Cash on Delivery" | "UPI (Demo)" | "Card (Demo)";
  status: OrderStatus;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
};

export const orderStatuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const seedOrders: Order[] = [
  {
    id: "ORD-24081",
    customer: "Ananya Deshmukh",
    phone: "+91 98765 43210",
    city: "Pune",
    date: "2026-08-24",
    items: [
      { productId: "RC-1001", name: "Rajwadi Maroon Banarasi Silk Saree", qty: 1, price: 6499, size: "Free Size" },
      { productId: "RC-6001", name: "Banarasi Zari Dupatta — Maroon", qty: 1, price: 1499, size: "Free Size" },
    ],
    total: 7998,
    payment: "UPI (Demo)",
    status: "Delivered",
  },
  {
    id: "ORD-24082",
    customer: "Meera Iyer",
    phone: "+91 91234 56780",
    city: "Bengaluru",
    date: "2026-08-26",
    items: [
      { productId: "RC-2002", name: "Pastel Peach Mirror Work Lehenga", qty: 1, price: 12499, size: "M" },
    ],
    total: 12499,
    payment: "Card (Demo)",
    status: "Shipped",
  },
  {
    id: "ORD-24083",
    customer: "Sneha Patil",
    phone: "+91 99887 76655",
    city: "Nashik",
    date: "2026-08-28",
    items: [
      { productId: "RC-4001", name: "Jaipuri Block Print Cotton Kurti Set", qty: 2, price: 1799, size: "L" },
    ],
    total: 3598,
    payment: "Cash on Delivery",
    status: "Processing",
  },
  {
    id: "ORD-24084",
    customer: "Ritu Sharma",
    phone: "+91 90909 11223",
    city: "Jaipur",
    date: "2026-08-30",
    items: [
      { productId: "RC-2001", name: "Royal Maroon Bridal Lehenga Choli", qty: 1, price: 24999, size: "S" },
    ],
    total: 24999,
    payment: "UPI (Demo)",
    status: "Pending",
  },
  {
    id: "ORD-24085",
    customer: "Fatima Shaikh",
    phone: "+91 93456 78901",
    city: "Mumbai",
    date: "2026-08-31",
    items: [
      { productId: "RC-5001", name: "Ivory Gold Sharara Set", qty: 1, price: 9499, size: "M" },
      { productId: "RC-6003", name: "Champagne Tissue Shimmer Dupatta", qty: 1, price: 999, size: "Free Size" },
    ],
    total: 10498,
    payment: "Card (Demo)",
    status: "Processing",
  },
  {
    id: "ORD-24086",
    customer: "Kavya Reddy",
    phone: "+91 88990 12345",
    city: "Hyderabad",
    date: "2026-09-01",
    items: [
      { productId: "RC-3001", name: "Champagne Gold Floor-Length Anarkali", qty: 1, price: 8999, size: "XL" },
    ],
    total: 8999,
    payment: "Cash on Delivery",
    status: "Pending",
  },
];

export const seedCustomers: Customer[] = [
  { id: "CUS-101", name: "Ananya Deshmukh", phone: "+91 98765 43210", email: "ananya.d@example.in", city: "Pune", orders: 4, spent: 21450, joined: "2025-11-12" },
  { id: "CUS-102", name: "Meera Iyer", phone: "+91 91234 56780", email: "meera.iyer@example.in", city: "Bengaluru", orders: 2, spent: 16890, joined: "2026-01-08" },
  { id: "CUS-103", name: "Sneha Patil", phone: "+91 99887 76655", email: "sneha.patil@example.in", city: "Nashik", orders: 6, spent: 18320, joined: "2025-08-19" },
  { id: "CUS-104", name: "Ritu Sharma", phone: "+91 90909 11223", email: "ritu.sharma@example.in", city: "Jaipur", orders: 1, spent: 24999, joined: "2026-08-29" },
  { id: "CUS-105", name: "Fatima Shaikh", phone: "+91 93456 78901", email: "fatima.s@example.in", city: "Mumbai", orders: 3, spent: 27640, joined: "2025-12-02" },
  { id: "CUS-106", name: "Kavya Reddy", phone: "+91 88990 12345", email: "kavya.reddy@example.in", city: "Hyderabad", orders: 2, spent: 12480, joined: "2026-03-15" },
  { id: "CUS-107", name: "Priya Nair", phone: "+91 97001 23456", email: "priya.nair@example.in", city: "Kochi", orders: 5, spent: 33110, joined: "2025-06-27" },
  { id: "CUS-108", name: "Harleen Kaur", phone: "+91 96543 21098", email: "harleen.k@example.in", city: "Ludhiana", orders: 3, spent: 19870, joined: "2026-02-11" },
];

export const business = {
  name: "Radhika Collection",
  tagline: "Timeless Indian ethnic wear for the modern woman",
  owner: "Radhika Kashyap",
  phone: "+91 98220 45678",
  whatsapp: "+91 98220 45678",
  email: "care@radhikacollection.in",
  address: "Shop No. 14, Laxmi Road, Near Ganesh Mandir, Pune, Maharashtra 411030",
  hours: "Monday – Sunday, 10:00 AM – 9:00 PM",
  gst: "27ABCDE1234F1Z5",
  established: 2012,
};
