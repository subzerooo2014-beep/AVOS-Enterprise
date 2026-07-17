import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeMarketplaceLicense, KnowledgeMarketplaceListing } from "./knowledge-marketplace.types";

@Injectable()
export class KnowledgeMarketplaceLicenseService {
  private readonly licenses = new Map<string, KnowledgeMarketplaceLicense>();

  issue(listing: KnowledgeMarketplaceListing, buyerId: string): KnowledgeMarketplaceLicense {
    const license: KnowledgeMarketplaceLicense = {
      id: randomUUID(), listingId: listing.id, buyerId, licenseType: listing.licenseType,
      rights: ["DISCOVER", "READ", "USE"],
      restrictions: listing.licenseType === "OPEN" ? [] : ["NO_UNAUTHORIZED_REDISTRIBUTION"],
      validFrom: new Date().toISOString(), active: true,
    };
    this.licenses.set(license.id, license);
    return structuredClone(license);
  }

  list(): KnowledgeMarketplaceLicense[] { return [...this.licenses.values()].map((item) => structuredClone(item)); }
  validate(id: string, buyerId: string): boolean { const item = this.licenses.get(id); return Boolean(item?.active && item.buyerId === buyerId); }
}