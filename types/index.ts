export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating?: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  active?: boolean;
}

export interface PromoOffer {
  badge: string;
  headline: string;
  code: string;
  description: string;
  ctaText: string;
  image: string;
  imageAlt: string;
}

export interface HeroContent {
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  descriptionLine1: string;
  descriptionLine2: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  videoUrl: string;
  backgroundImage: string;
  image: string;
  imageAlt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type FulfillmentType = "delivery" | "takeaway";

export type CheckoutPaymentMethod =
  | "cash_on_delivery"
  | "cash_on_pickup"
  | "card";

export interface CheckoutRequest {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  fulfillment: FulfillmentType;
  destination: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: CheckoutPaymentMethod;
  promoCode?: string;
  notes?: string;
}

export interface CheckoutResponse {
  orderId: string;
  paymentStatus: "pending" | "paid";
  checkoutUrl?: string;
}

export type OrderStatus = "preparing" | "ready" | "delivered" | "completed";

export interface Order {
  id: string;
  items: CartItem[];
  fulfillment: FulfillmentType;
  destination: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  date: string;
  status: OrderStatus;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  orders: Order[];
  unlockedCoupons: string[];
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  hoursWeekday: string;
  hoursWeekend: string;
  phone: string;
  dineIn: boolean;
  takeaway: boolean;
  deliveryAvailable: boolean;
}
