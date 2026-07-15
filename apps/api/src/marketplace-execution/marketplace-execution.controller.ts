import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { MarketplaceExecutionService } from "./marketplace-execution.service";
import {
  CartItem,
  ChatThread,
  MarketplaceOrder,
  NegotiationOffer,
  OrderStatus,
  PaymentRecord,
  ShipmentRecord,
} from "./marketplace-execution.types";

@Controller("marketplace-execution")
export class MarketplaceExecutionController {
  constructor(private readonly execution: MarketplaceExecutionService) {}

  @Get("components")
  components() {
    return this.execution.components();
  }

  @Post("carts")
  createCart(
    @Body() body: { tenantId: string; customerId: string; currency: string },
  ) {
    return this.execution.createCart(
      body.tenantId,
      body.customerId,
      body.currency,
    );
  }

  @Post("carts/:id/items")
  addCartItem(
    @Param("id") id: string,
    @Body() input: Omit<CartItem, "id">,
  ) {
    return this.execution.addCartItem(id, input);
  }

  @Post("reservations")
  reserveItem(
    @Body() body: { cartId: string; itemId: string; expiresAt: string },
  ) {
    return this.execution.reserveItem(
      body.cartId,
      body.itemId,
      body.expiresAt,
    );
  }

  @Post("offers")
  createOffer(
    @Body()
    input: Omit<
      NegotiationOffer,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.execution.createOffer(input);
  }

  @Patch("offers/:id/accept")
  acceptOffer(@Param("id") id: string) {
    return this.execution.acceptOffer(id);
  }

  @Post("contracts")
  createContract(
    @Body()
    body: {
      tenantId: string;
      dealId: string;
      templateKey: string;
      terms: Record<string, unknown>;
    },
  ) {
    return this.execution.createContract(
      body.tenantId,
      body.dealId,
      body.templateKey,
      body.terms,
    );
  }

  @Patch("contracts/:id/sign")
  signContract(
    @Param("id") id: string,
    @Body() body: { party: "BUYER" | "SELLER" },
  ) {
    return this.execution.signContract(id, body.party);
  }

  @Post("checkout")
  checkout(
    @Body()
    body: {
      cartId: string;
      deliveryMethod: MarketplaceOrder["deliveryMethod"];
      metadata: Record<string, unknown>;
    },
  ) {
    return this.execution.checkout(
      body.cartId,
      body.deliveryMethod,
      body.metadata,
    );
  }

  @Patch("orders/:id/status")
  updateOrderStatus(
    @Param("id") id: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.execution.updateOrderStatus(id, body.status);
  }

  @Post("payments")
  createPayment(
    @Body()
    input: Omit<PaymentRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.execution.createPayment(input);
  }

  @Patch("payments/:id/capture")
  capturePayment(
    @Param("id") id: string,
    @Body() body: { providerReference: string },
  ) {
    return this.execution.capturePayment(id, body.providerReference);
  }

  @Patch("payments/:id/refund")
  refundPayment(@Param("id") id: string) {
    return this.execution.refundPayment(id);
  }

  @Post("shipments")
  createShipment(
    @Body()
    input: Omit<ShipmentRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.execution.createShipment(input);
  }

  @Patch("shipments/:id/carrier")
  assignCarrier(
    @Param("id") id: string,
    @Body() body: { carrierId: string; trackingNumber: string },
  ) {
    return this.execution.assignCarrier(
      id,
      body.carrierId,
      body.trackingNumber,
    );
  }

  @Post("chats")
  createChat(
    @Body()
    body: {
      tenantId: string;
      contextType: ChatThread["contextType"];
      contextId: string;
      participants: string[];
    },
  ) {
    return this.execution.createChat(
      body.tenantId,
      body.contextType,
      body.contextId,
      body.participants,
    );
  }

  @Post("chats/:id/messages")
  sendMessage(
    @Param("id") id: string,
    @Body() body: { senderId: string; body: string },
  ) {
    return this.execution.sendMessage(
      id,
      body.senderId,
      body.body,
    );
  }

  @Get("dashboard")
  dashboard() {
    return this.execution.dashboard();
  }
}