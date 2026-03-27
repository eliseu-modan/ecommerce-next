import type { Cart, Product } from "@/lib/types";

const CART_PREFIX = "store_cart";

function getCartKey(userId?: string | null) {
  return `${CART_PREFIX}:${userId || "guest"}`;
}

export function readCart(userId?: string | null): Cart {
  if (typeof window === "undefined") {
    return { id: "local-cart", userId: userId || "guest", items: [] };
  }

  const raw = localStorage.getItem(getCartKey(userId));
  if (!raw) {
    return { id: "local-cart", userId: userId || "guest", items: [] };
  }

  try {
    return JSON.parse(raw) as Cart;
  } catch {
    return { id: "local-cart", userId: userId || "guest", items: [] };
  }
}

export function writeCart(cart: Cart, userId?: string | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
}

export function addProductToCart(product: Product, quantity: number, userId?: string | null) {
  const cart = readCart(userId);
  const existing = cart.items.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      id: `local-${product.id}`,
      cartId: cart.id,
      productId: product.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
      },
    });
  }

  writeCart(cart, userId);
  return cart;
}

export function updateCartProductQuantity(
  productId: string,
  quantity: number,
  userId?: string | null,
) {
  const cart = readCart(userId);
  cart.items = cart.items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );
  writeCart(cart, userId);
  return cart;
}

export function removeProductFromCart(productId: string, userId?: string | null) {
  const cart = readCart(userId);
  cart.items = cart.items.filter((item) => item.productId !== productId);
  writeCart(cart, userId);
  return cart;
}

export function clearCart(userId?: string | null) {
  const cart = { id: "local-cart", userId: userId || "guest", items: [] };
  writeCart(cart, userId);
  return cart;
}
