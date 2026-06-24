/**
 * Central API client for Veena Organics backend
 * Base URL: http://103.224.246.148:8463
 * Auth: HTTP Basic Auth (server-level credential, not per-user)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://103.224.246.148:8463";
const STORE_ID = Number(process.env.NEXT_PUBLIC_STORE_ID ?? "6");

// Auth header — only added if credentials are configured
function getAuthHeader(): string | null {
  const user = process.env.API_USERNAME;
  const pass = process.env.API_PASSWORD;
  if (!user && !pass) return null;
  return "Basic " + Buffer.from(`${user ?? ""}:${pass ?? ""}`).toString("base64");
}

// ─── Response shape ───────────────────────────────────────────────────────────

export interface GlobalResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  rowCount: number;
  groupId?: number;
}

// ─── API types (mapped from OpenAPI schema) ───────────────────────────────────

export interface ApiProduct {
  productId: number;
  groupId: number;
  categoryId: number;
  subCategoryId: number;
  productName: string;
  productImage: string | null;
  productDescription: string | null;
  mrp: number;
  price: number;
  costPrice: number;
  unit: number;
  unitType: string;
  inventory: number;
  minStockQuantity: number;
  status: "active" | "inactive";
  brandId: number;
  typeId: number;
  gst: number;
  cess: number;
  attributeId: number;
  skuCode: string | null;
  barcode: string | null;
  storeId: number;
}

export interface ApiCategory {
  categoryId?: number;
  id?: number;
  categoryName: string;
  categoryImage: string | null;
  description?: string | null;
  status?: string;
  storeId?: number;
}

export interface ApiSubCategory {
  subCategoryId?: number;
  id?: number;
  subcategoryName?: string;
  subCategoryName?: string;
  categoryId: number;
  categoryName?: string;
  subCategoryImage?: string | null;
  status?: string;
}

export interface ApiCustomer {
  customerId?: number;
  customerName: string;
  phoneNumber: string;
  email: string;
  customerActive?: boolean;
  verified?: boolean;
  customerImage?: string;
  userAddress?: ApiAddress[];
  storeIds?: string;
}

export interface ApiAddress {
  addressId?: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
  addressType?: string;
}

export interface ApiOrder {
  orderId: number;
  customerId?: number;
  customerName: string;
  customerPhoneNumber: string;
  fullAddress: string;
  orderGrossAmount: number;
  orderNetAmount: number;
  taxAmount: number;
  discount: number;
  orderStatus: "placed" | "accepted" | "rejected" | "ready";
  trackOrder: "new_order" | "cancelled" | "completed" | "in_transit" | "failed";
  paymentStatus: "PAID" | "REFUNDED" | "PENDING";
  paymentMode: string;
  orderType: "web" | "mobile" | "pos";
  orderCreatedDate: string;
  orderItems?: ApiOrderItem[];
  uuid?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

export interface ApiOrderItem {
  productId: number;
  groupId: string;
  categoryId: number;
  subCategoryId: number;
  productName: string;
  productImage: string;
  mrp: number;
  price: number;
  quantity: number;
  unit: number;
  unitType: string;
  brandId: number;
  typeId: number;
  attributeId: number;
  gst?: number;
  cess?: number;
}

export interface LoginResponse {
  token?: string;
  customerId?: number;
  customerName?: string;
  email?: string;
  phoneNumber?: string;
  [key: string]: unknown;
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  queryParams?: Record<string, string | number | boolean | undefined>
): Promise<GlobalResponse<T>> {
  const url = new URL(path, BASE_URL);

  if (queryParams) {
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }

  const authHeader = getAuthHeader();
  const res = await fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...options.headers,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} — ${path}`);
  }

  return res.json() as Promise<GlobalResponse<T>>;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  storeId?: number;
}): Promise<ApiProduct[]> {
  const res = await apiFetch<ApiProduct[] | { content?: ApiProduct[] }>("/product/getAllProducts", {}, {
    storeId: params?.storeId ?? STORE_ID,
    searchString: params?.searchString,
    pageNumber: params?.pageNumber ?? 0,
    pageSize: params?.pageSize ?? 50,
    sortBy: params?.sortBy ?? "product_name",
    order: params?.order ?? "asc",
  });

  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "content" in data && Array.isArray(data.content)) return data.content;
  return [];
}

export async function getProductsByCategory(categoryIds: number[]): Promise<ApiProduct[]> {
  const url = new URL("/product/find-by-category", BASE_URL);
  url.searchParams.set("storeId", String(STORE_ID));
  categoryIds.forEach(id => url.searchParams.append("categoryId", String(id)));

  const authHeader = getAuthHeader();
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json: GlobalResponse<ApiProduct[]> = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

export async function searchProducts(searchString: string): Promise<ApiProduct[]> {
  const res = await apiFetch<ApiProduct[]>("/product/searchStoreOrProduct", {}, { searchString, storeId: STORE_ID });
  return Array.isArray(res.data) ? res.data : [];
}

export async function getProductGroups(storeId = STORE_ID) {
  const res = await apiFetch("/product/getProductsByGroup", {}, { storeId });
  return res.data;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(params?: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  storeId?: number | string;
}): Promise<ApiCategory[]> {
  const res = await apiFetch<ApiCategory[] | { content?: ApiCategory[] }>("/category/getAllCategories", {}, {
    storeId: params?.storeId ?? STORE_ID,
    searchString: params?.searchString,
    pageNumber: params?.pageNumber ?? 0,
    pageSize: params?.pageSize ?? 50,
    sortBy: "category_name",
    order: "asc",
  });

  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "content" in data && Array.isArray((data as { content?: ApiCategory[] }).content)) {
    return (data as { content: ApiCategory[] }).content;
  }
  return [];
}

export async function getSubCategories(params?: {
  pageSize?: number;
  storeId?: number;
}): Promise<ApiSubCategory[]> {
  const res = await apiFetch<ApiSubCategory[] | { content?: ApiSubCategory[] }>("/subCategory/getAllSubCategories", {}, {
    storeId: params?.storeId ?? STORE_ID,
    pageNumber: 0,
    pageSize: params?.pageSize ?? 100,
  });

  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "content" in data && Array.isArray((data as { content?: ApiSubCategory[] }).content)) {
    return (data as { content: ApiSubCategory[] }).content;
  }
  return [];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

// Send OTP to phone number
export async function sendOtp(phoneNumber: string): Promise<GlobalResponse<unknown>> {
  return apiFetch("/login/otp", {
    method: "POST",
    body: JSON.stringify({ mobileNo: phoneNumber, mobileNoCode: "+91" }),
    next: { revalidate: 0 },
  });
}

// Verify OTP — returns customer data on success
export async function verifyOtp(phoneNumber: string, otp: string): Promise<GlobalResponse<LoginResponse>> {
  return apiFetch<LoginResponse>("/login/verifyOtp", {
    method: "POST",
    body: JSON.stringify({ mobileNo: phoneNumber, otp }),
    next: { revalidate: 0 },
  });
}

// Register / update customer (no password — OTP is the auth method)
export async function registerCustomer(data: {
  customerName: string;
  phoneNumber: string;
  email?: string;
  storeIds?: string;
}): Promise<GlobalResponse<ApiCustomer>> {
  return apiFetch<ApiCustomer>("/customer/addUpdateCustomer", {
    method: "POST",
    body: JSON.stringify({ ...data, storeIds: data.storeIds ?? String(STORE_ID) }),
    next: { revalidate: 0 },
  });
}

// Keep for backwards compat but OTP is primary auth
export async function loginUser(email: string, password: string): Promise<GlobalResponse<LoginResponse>> {
  return apiFetch<LoginResponse>("/login/userlogin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    next: { revalidate: 0 },
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function placeOrder(orders: Record<string, unknown>[]): Promise<GlobalResponse<unknown>> {
  return apiFetch("/placeOrder/order", {
    method: "POST",
    body: JSON.stringify(orders),
    next: { revalidate: 0 },
  });
}

export async function getOrders(params?: {
  pageNumber?: number;
  pageSize?: number;
  storeId?: number;
  filterOptions?: string;
  customerId?: number;
}): Promise<ApiOrder[]> {
  const res = await apiFetch<ApiOrder[] | { content?: ApiOrder[] }>("/placeOrder/getAllPlaceOrder", {}, {
    storeId: params?.storeId ?? STORE_ID,
    pageNumber: params?.pageNumber ?? 0,
    pageSize: params?.pageSize ?? 50,
    filterOptions: params?.filterOptions,
    ...(params?.customerId ? { customerId: params.customerId } : {}),
  });

  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "content" in data && Array.isArray((data as { content?: ApiOrder[] }).content)) {
    return (data as { content: ApiOrder[] }).content;
  }
  return [];
}

export async function getOrderById(id: number): Promise<ApiOrder | null> {
  const res = await apiFetch<ApiOrder>(`/placeOrder/getOrder/${id}`, {}, undefined);
  return res.data ?? null;
}

// ─── Razorpay ─────────────────────────────────────────────────────────────────

export interface CreateRazorpayOrderPayload {
  requestId: string;
  clientId: string;
  currency: string;
  amount: number;
  surcharge?: number;
  paymentMode: string;
  customerName: string;
  customerIdentifier: string;
}

export interface CreateRazorpayOrderResponse {
  id?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  [key: string]: unknown;
}

export async function createRazorpayOrder(
  payload: CreateRazorpayOrderPayload
): Promise<CreateRazorpayOrderResponse> {
  const res = await apiFetch<CreateRazorpayOrderResponse>("/processRazorPayPayment", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
  return (res.data ?? res) as CreateRazorpayOrderResponse;
}

export async function updateRazorpayOrder(payload: {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  [key: string]: unknown;
}): Promise<GlobalResponse<unknown>> {
  return apiFetch("/updateRazorPayOrder", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
}

// ─── Bulk Orders ──────────────────────────────────────────────────────────────

export async function placeBulkOrder(payload: {
  productName?: string;
  contactNumber: string;
  contactAddress: string;
  cost?: number;
  storeId?: number;
  remarks?: string;
  isPartyOrder?: number;
}): Promise<GlobalResponse<unknown>> {
  return apiFetch("/bulk/order", {
    method: "POST",
    body: JSON.stringify({ ...payload, storeId: payload.storeId ?? STORE_ID }),
    next: { revalidate: 0 },
  });
}

// ─── Advertisements / Banners ─────────────────────────────────────────────────

export async function getAdvertisements(storeId = STORE_ID) {
  const res = await apiFetch("/advertizement/getAllAdvertisement", {}, { storeId, pageSize: 20 });
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "content" in data) return (data as { content: unknown[] }).content;
  return [];
}

// ─── Utility: map API product → local Product type ───────────────────────────

import type { Product } from "@/types";

export function mapApiProduct(p: ApiProduct, categoryMap?: Map<number, string>): Product {
  return {
    id: String(p.productId),
    itemName: p.productName,
    itemPrice: p.price ?? p.mrp,
    itemImage: p.productImage || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600",
    itemDescription: p.productDescription ?? "",
    sku: p.skuCode ?? `SKU-${p.productId}`,
    category: categoryMap?.get(p.categoryId) ?? String(p.categoryId),
    subcategory: String(p.subCategoryId),
    brand: String(p.brandId),
    dietaryTags: "Organic",
    stockQuantity: p.inventory,
    lowStockThreshold: p.minStockQuantity,
    isBestSeller: false,
    botanicalDetails: "",
    traditionalUses: "",
    historicalBackground: "",
    availableFormsPackaging: `${p.unit} ${p.unitType}`,
    storageInstructions: "",
  };
}

export function mapApiCategory(c: ApiCategory): { id: string; categoryName: string; categoryImage: string; description: string; slug: string; displayOrder: number } {
  const id = String(c.categoryId ?? c.id ?? "");
  return {
    id,
    categoryName: c.categoryName,
    categoryImage: c.categoryImage || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800",
    description: c.description ?? "",
    slug: c.categoryName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    displayOrder: Number(id) || 0,
  };
}
