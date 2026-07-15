export type CartStatus = "ACTIVE" | "CHECKED_OUT" | "ABANDONED";
export type OrderStatus =
  | "CREATED"
  | "CONFIRMED"
  | "PAID"
  | "FULFILLING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface CartItem {
  id: string;
  industryKey: string;
  entityId: string;
  entityType: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  metadata: Record<string, unknown>;
}

export interface UnifiedCart {
  id: string;
  tenantId: string;
  customerId: string;
  status: CartStatus;
  items: CartItem[];
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  cartId: string;
  itemId: string;
  tenantId: string;
  expiresAt: string;
  status: "ACTIVE" | "CONSUMED" | "RELEASED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface NegotiationOffer {
  id: string;
  tenantId: string;
  buyerId: string;
  sellerId: string;
  entityId: string;
  amount: number;
  currency: string;
  status: "OPEN" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalContract {
  id: string;
  tenantId: string;
  dealId: string;
  templateKey: string;
  version: number;
  terms: Record<string, unknown>;
  buyerSignedAt?: string;
  sellerSignedAt?: string;
  status: "DRAFT" | "PENDING_SIGNATURES" | "SIGNED" | "VOID";
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  tenantId: string;
  orderId: string;
  provider: string;
  amount: number;
  currency: string;
  splits: Array<{
    recipientId: string;
    amount: number;
    type: "SELLER" | "PLATFORM" | "PARTNER" | "TAX";
  }>;
  status: "PENDING" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
  providerReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceOrder {
  id: string;
  tenantId: string;
  customerId: string;
  cartId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency: string;
  deliveryMethod: "PICKUP" | "DELIVERY" | "EXPORT";
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentRecord {
  id: string;
  tenantId: string;
  orderId: string;
  carrierId?: string;
  trackingNumber?: string;
  status: "CREATED" | "MATCHED" | "IN_TRANSIT" | "CUSTOMS" | "DELIVERED";
  origin: string;
  destination: string;
  exportDocuments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatThread {
  id: string;
  tenantId: string;
  contextType: "DEAL" | "ORDER" | "FINANCE" | "INSURANCE";
  contextId: string;
  participants: string[];
  messages: Array<{
    id: string;
    senderId: string;
    body: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}