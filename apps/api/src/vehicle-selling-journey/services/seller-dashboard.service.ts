import { Injectable } from "@nestjs/common";
import { SellingRepositoryService } from "./selling-repository.service";
import { LeadManagementService } from "./lead-management.service";
import { SellerOfferService } from "./seller-offer.service";
@Injectable()
export class SellerDashboardService {
  constructor(
    private readonly repo: SellingRepositoryService,
    private readonly leads: LeadManagementService,
    private readonly offers: SellerOfferService,
  ) {}
  summary() {
    const records = this.repo.list();
    return {
      totalListings: records.length,
      published: records.filter((record) => record.stage === "PUBLISHED").length,
      sold: records.filter((record) => ["SOLD", "COMPLETED"].includes(record.stage)).length,
      leads: this.leads.list().length,
      offers: this.offers.list().length,
    };
  }
}
