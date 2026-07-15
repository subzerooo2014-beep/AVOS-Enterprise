import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CartItem,
  ChatThread,
  DigitalContract,
  MarketplaceOrder,
  NegotiationOffer,
  OrderStatus,
  PaymentRecord,
  Reservation,
  ShipmentRecord,
  UnifiedCart,
} from "./marketplace-execution.types";
import { MARKETPLACE_EXECUTION_COMPONENTS } from "./marketplace-execution.registry";

@Injectable()
export class MarketplaceExecutionService {
  private readonly carts = new Map<string, UnifiedCart>();
  private readonly reservations = new Map<string, Reservation>();
  private readonly offers = new Map<string, NegotiationOffer>();
  private readonly contracts = new Map<string, DigitalContract>();
  private readonly orders = new Map<string, MarketplaceOrder>();
  private readonly payments = new Map<string, PaymentRecord>();
  private readonly shipments = new Map<string, ShipmentRecord>();
  private readonly chats = new Map<string, ChatThread>();

  components() {
    return {
      system: "AVOS Marketplace Execution Super Bundle",
      architecture: "INDUSTRY_BASED",
      components: [...MARKETPLACE_EXECUTION_COMPONENTS],
      status: "READY",
    };
  }

  createCart(
    tenantId: string,
    customerId: string,
    currency: string,
  ): UnifiedCart {
    const now = new Date().toISOString();
    const cart: UnifiedCart = {
      id: randomUUID(),
      tenantId,
      customerId,
      status: "ACTIVE",
      items: [],
      subtotal: 0,
      tax: 0,
      fees: 0,
      total: 0,
      currency,
      createdAt: now,
      updatedAt: now,
    };

    this.carts.set(cart.id, cart);
    return this.cloneCart(cart);
  }

  addCartItem(
    cartId: string,
    input: Omit<CartItem, "id">,
  ): UnifiedCart {
    const cart = this.requireCart(cartId);

    if (cart.status !== "ACTIVE") {
      throw new Error("Only active carts can be modified");
    }

    if (input.quantity <= 0 || input.unitPrice <= 0) {
      throw new Error("Invalid cart item values");
    }

    cart.items.push({
      ...input,
      id: randomUUID(),
      metadata: { ...input.metadata },
    });

    this.recalculateCart(cart);
    this.carts.set(cart.id, cart);
    return this.cloneCart(cart);
  }

  reserveItem(
    cartId: string,
    itemId: string,
    expiresAt: string,
  ): Reservation {
    const cart = this.requireCart(cartId);
    const item = cart.items.find((value) => value.id === itemId);

    if (!item) {
      throw new Error(`Cart item not found: ${itemId}`);
    }

    const now = new Date().toISOString();
    const reservation: Reservation = {
      id: randomUUID(),
      cartId,
      itemId,
      tenantId: cart.tenantId,
      expiresAt,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    this.reservations.set(reservation.id, reservation);
    return { ...reservation };
  }

  createOffer(
    input: Omit<
      NegotiationOffer,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): NegotiationOffer {
    const now = new Date().toISOString();
    const offer: NegotiationOffer = {
      ...input,
      id: randomUUID(),
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
    };

    this.offers.set(offer.id, offer);
    return { ...offer };
  }

  acceptOffer(id: string): NegotiationOffer {
    const offer = this.requireOffer(id);
    offer.status = "ACCEPTED";
    offer.updatedAt = new Date().toISOString();
    this.offers.set(id, offer);
    return { ...offer };
  }

  createContract(
    tenantId: string,
    dealId: string,
    templateKey: string,
    terms: Record<string, unknown>,
  ): DigitalContract {
    const now = new Date().toISOString();
    const contract: DigitalContract = {
      id: randomUUID(),
      tenantId,
      dealId,
      templateKey,
      version: 1,
      terms: { ...terms },
      status: "PENDING_SIGNATURES",
      createdAt: now,
      updatedAt: now,
    };

    this.contracts.set(contract.id, contract);
    return this.cloneContract(contract);
  }

  signContract(
    id: string,
    party: "BUYER" | "SELLER",
  ): DigitalContract {
    const contract = this.requireContract(id);
    const now = new Date().toISOString();

    if (party === "BUYER") {
      contract.buyerSignedAt = now;
    } else {
      contract.sellerSignedAt = now;
    }

    if (contract.buyerSignedAt && contract.sellerSignedAt) {
      contract.status = "SIGNED";
    }

    contract.updatedAt = now;
    this.contracts.set(id, contract);
    return this.cloneContract(contract);
  }

  checkout(
    cartId: string,
    deliveryMethod: MarketplaceOrder["deliveryMethod"],
    metadata: Record<string, unknown>,
  ): MarketplaceOrder {
    const cart = this.requireCart(cartId);

    if (cart.items.length === 0) {
      throw new Error("Cannot checkout an empty cart");
    }

    cart.status = "CHECKED_OUT";
    cart.updatedAt = new Date().toISOString();
    this.carts.set(cart.id, cart);

    const now = new Date().toISOString();
    const order: MarketplaceOrder = {
      id: randomUUID(),
      tenantId: cart.tenantId,
      customerId: cart.customerId,
      cartId: cart.id,
      status: "CREATED",
      subtotal: cart.subtotal,
      tax: cart.tax,
      fees: cart.fees,
      total: cart.total,
      currency: cart.currency,
      deliveryMethod,
      metadata: { ...metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.orders.set(order.id, order);
    return this.cloneOrder(order);
  }

  updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): MarketplaceOrder {
    const order = this.requireOrder(id);
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.orders.set(id, order);
    return this.cloneOrder(order);
  }

  createPayment(
    input: Omit<PaymentRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): PaymentRecord {
    const order = this.requireOrder(input.orderId);

    if (Number(input.splits.reduce((sum, split) => sum + split.amount, 0).toFixed(2)) !== Number(input.amount.toFixed(2))) {
      throw new Error("Payment splits must equal payment amount");
    }

    const now = new Date().toISOString();
    const payment: PaymentRecord = {
      ...input,
      id: randomUUID(),
      splits: input.splits.map((split) => ({ ...split })),
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    this.payments.set(payment.id, payment);

    if (order.total !== payment.amount) {
      throw new Error("Payment amount must equal order total");
    }

    return this.clonePayment(payment);
  }

  capturePayment(
    id: string,
    providerReference: string,
  ): PaymentRecord {
    const payment = this.requirePayment(id);
    payment.status = "CAPTURED";
    payment.providerReference = providerReference;
    payment.updatedAt = new Date().toISOString();
    this.payments.set(id, payment);

    const order = this.requireOrder(payment.orderId);
    order.status = "PAID";
    order.updatedAt = new Date().toISOString();
    this.orders.set(order.id, order);

    return this.clonePayment(payment);
  }

  refundPayment(id: string): PaymentRecord {
    const payment = this.requirePayment(id);
    payment.status = "REFUNDED";
    payment.updatedAt = new Date().toISOString();
    this.payments.set(id, payment);

    const order = this.requireOrder(payment.orderId);
    order.status = "REFUNDED";
    order.updatedAt = new Date().toISOString();
    this.orders.set(order.id, order);

    return this.clonePayment(payment);
  }

  createShipment(
    input: Omit<ShipmentRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): ShipmentRecord {
    this.requireOrder(input.orderId);

    const now = new Date().toISOString();
    const shipment: ShipmentRecord = {
      ...input,
      id: randomUUID(),
      exportDocuments: [...input.exportDocuments],
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };

    this.shipments.set(shipment.id, shipment);
    return this.cloneShipment(shipment);
  }

  assignCarrier(
    id: string,
    carrierId: string,
    trackingNumber: string,
  ): ShipmentRecord {
    const shipment = this.requireShipment(id);
    shipment.carrierId = carrierId;
    shipment.trackingNumber = trackingNumber;
    shipment.status = "MATCHED";
    shipment.updatedAt = new Date().toISOString();
    this.shipments.set(id, shipment);
    return this.cloneShipment(shipment);
  }

  createChat(
    tenantId: string,
    contextType: ChatThread["contextType"],
    contextId: string,
    participants: string[],
  ): ChatThread {
    const now = new Date().toISOString();
    const thread: ChatThread = {
      id: randomUUID(),
      tenantId,
      contextType,
      contextId,
      participants: [...participants],
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    this.chats.set(thread.id, thread);
    return this.cloneChat(thread);
  }

  sendMessage(
    threadId: string,
    senderId: string,
    body: string,
  ): ChatThread {
    const thread = this.requireChat(threadId);

    if (!thread.participants.includes(senderId)) {
      throw new Error("Sender is not a participant in this thread");
    }

    thread.messages.push({
      id: randomUUID(),
      senderId,
      body,
      createdAt: new Date().toISOString(),
    });

    thread.updatedAt = new Date().toISOString();
    this.chats.set(thread.id, thread);
    return this.cloneChat(thread);
  }

  dashboard() {
    return {
      system: "AVOS Marketplace Execution Super Bundle",
      carts: this.carts.size,
      reservations: this.reservations.size,
      offers: this.offers.size,
      contracts: this.contracts.size,
      orders: this.orders.size,
      payments: this.payments.size,
      shipments: this.shipments.size,
      chats: this.chats.size,
      components: MARKETPLACE_EXECUTION_COMPONENTS.length,
      generatedAt: new Date().toISOString(),
    };
  }

  private recalculateCart(cart: UnifiedCart) {
    cart.subtotal = Number(
      cart.items
        .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
        .toFixed(2),
    );
    cart.tax = Number((cart.subtotal * 0.05).toFixed(2));
    cart.fees = Number((cart.subtotal * 0.02).toFixed(2));
    cart.total = Number(
      (cart.subtotal + cart.tax + cart.fees).toFixed(2),
    );
    cart.updatedAt = new Date().toISOString();
  }

  private requireCart(id: string) {
    const value = this.carts.get(id);
    if (!value) throw new Error(`Cart not found: ${id}`);
    return value;
  }

  private requireOffer(id: string) {
    const value = this.offers.get(id);
    if (!value) throw new Error(`Offer not found: ${id}`);
    return value;
  }

  private requireContract(id: string) {
    const value = this.contracts.get(id);
    if (!value) throw new Error(`Contract not found: ${id}`);
    return value;
  }

  private requireOrder(id: string) {
    const value = this.orders.get(id);
    if (!value) throw new Error(`Order not found: ${id}`);
    return value;
  }

  private requirePayment(id: string) {
    const value = this.payments.get(id);
    if (!value) throw new Error(`Payment not found: ${id}`);
    return value;
  }

  private requireShipment(id: string) {
    const value = this.shipments.get(id);
    if (!value) throw new Error(`Shipment not found: ${id}`);
    return value;
  }

  private requireChat(id: string) {
    const value = this.chats.get(id);
    if (!value) throw new Error(`Chat thread not found: ${id}`);
    return value;
  }

  private cloneCart(value: UnifiedCart): UnifiedCart {
    return {
      ...value,
      items: value.items.map((item) => ({
        ...item,
        metadata: { ...item.metadata },
      })),
    };
  }

  private cloneContract(value: DigitalContract): DigitalContract {
    return { ...value, terms: { ...value.terms } };
  }

  private cloneOrder(value: MarketplaceOrder): MarketplaceOrder {
    return { ...value, metadata: { ...value.metadata } };
  }

  private clonePayment(value: PaymentRecord): PaymentRecord {
    return {
      ...value,
      splits: value.splits.map((split) => ({ ...split })),
    };
  }

  private cloneShipment(value: ShipmentRecord): ShipmentRecord {
    return {
      ...value,
      exportDocuments: [...value.exportDocuments],
    };
  }

  private cloneChat(value: ChatThread): ChatThread {
    return {
      ...value,
      participants: [...value.participants],
      messages: value.messages.map((message) => ({ ...message })),
    };
  }
}