export type UserRole = "ADMIN" | "USER" | string;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string | null;
  googleId?: string | null;
  facebookId?: string | null;
}

export interface ProductImage {
  url: string;
  altText?: string | null;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  categoryId?: string;
  createdAt?: string;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Address {
  id: string;
  type: "DELIVERY" | "BILLING" | string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  complement?: string | null;
  createdAt?: string;
}

export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  images?: ProductImage[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id?: string;
  orderId?: string;
  method: string;
  status: string;
  amountPaid: number | string;
  paidAt?: string | Date | null;
}

export interface OrderItem {
  id?: string;
  orderId?: string;
  productId: string;
  quantity: number;
  unitPrice: number | string;
  subtotal: number | string;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number | string;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment | null;
}

export interface ShippingQuote {
  userId?: string;
  distance?: {
    text: string;
    value: number;
  };
  duration?: {
    text: string;
    value: number;
  };
  freightCost?: string;
}
