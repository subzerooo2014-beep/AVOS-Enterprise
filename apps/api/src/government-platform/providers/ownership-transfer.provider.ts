import { Injectable } from "@nestjs/common";
import { OwnershipTransferPolicy } from "../policies/ownership-transfer.policy";
@Injectable()
export class OwnershipTransferProvider {
  private readonly transfers = new Map<string, Record<string, unknown>>();
  constructor(private readonly policy: OwnershipTransferPolicy) {}

  start(input: {
    vehicleId: string;
    sellerId: string;
    buyerId: string;
    agreedPrice: number;
  }) {
    this.policy.validate(input);
    const transfer = {
      id: `transfer_${Date.now()}`,
      ...input,
      buyerApproved: false,
      sellerApproved: false,
      status: "PENDING_APPROVALS",
      createdAt: new Date().toISOString(),
    };
    this.transfers.set(String(transfer.id), transfer);
    return transfer;
  }

  approve(transferId: string, actorRole: "BUYER" | "SELLER") {
    const transfer = this.transfers.get(transferId);
    if (!transfer) throw new Error("Transfer not found");
    if (actorRole === "BUYER") transfer.buyerApproved = true;
    if (actorRole === "SELLER") transfer.sellerApproved = true;
    transfer.status =
      transfer.buyerApproved && transfer.sellerApproved
        ? "APPROVED"
        : "PENDING_APPROVALS";
    return transfer;
  }

  complete(
    transferId: string,
    paymentReference: string,
    authorityReference: string,
  ) {
    const transfer = this.transfers.get(transferId);
    if (!transfer) throw new Error("Transfer not found");
    transfer.paymentReference = paymentReference;
    transfer.authorityReference = authorityReference;
    transfer.status = "COMPLETED";
    return transfer;
  }
}
