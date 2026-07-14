import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceCatalogService {
  categories() {
    return [
      "VEHICLES",
      "PARTS",
      "ACCESSORIES",
      "WORKSHOP_SERVICES",
      "INSPECTION",
      "INSURANCE",
      "FINANCE",
      "SHIPPING",
    ];
  }
}
