export interface Product {
  id: string;
  itemName: string;
  itemPrice: number;
  itemImage: string;
  itemDescription: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  dietaryTags: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isBestSeller: boolean;
  botanicalDetails: string;
  traditionalUses: string;
  historicalBackground: string;
  availableFormsPackaging: string;
  storageInstructions: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCategory {
  id: string;
  categoryName: string;
  categoryImage: string;
  description: string;
  slug: string;
  displayOrder: number;
}

export interface Subcategory {
  id: string;
  name: string;
  parentCategory: string;
  image: string;
  description: string;
  slug: string;
  displayOrder: number;
}

export interface PoojaPackage {
  id: string;
  itemName: string;
  itemPrice: number;
  itemImage: string;
  itemDescription: string;
  stockQuantity: number;
  lowStockThreshold: number;
  packageDuration: string;
  packageInclusions: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  memberId: string;
  orderDate: Date | string;
  productNames: string;
  productQuantities: string;
  productPrices: string;
  totalAmount: number;
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: "Online" | "COD";
  createdAt?: Date;
}

export interface BrandValue {
  id: string;
  title: string;
  icon: string;
  shortDescription: string;
  detailedDescription: string;
  learnMoreLink: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  weight?: string;
  type: "product" | "pooja_package";
}

export interface DeliveryAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type WeightVariant = "100g" | "250g" | "500g" | "1kg" | "Bulk";

export const WEIGHT_MULTIPLIERS: Record<WeightVariant, number> = {
  "100g": 0.3,
  "250g": 0.6,
  "500g": 1.0,
  "1kg": 1.8,
  "Bulk": 3.5,
};
