import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { INDUSTRY_VERTICALS } from "./industry-expansion.registry";
import {
  IndustryListing,
  IndustryListingRequest,
} from "./industry-expansion.types";

@Injectable()
export class IndustryExpansionService {
  private readonly listings = new Map<string, IndustryListing>();

  verticals() {
    return INDUSTRY_VERTICALS.map((vertical) => ({
      ...vertical,
      capabilities: [...vertical.capabilities],
    }));
  }

  vertical(key: string) {
    const vertical = INDUSTRY_VERTICALS.find((item) => item.key === key);

    if (!vertical) {
      throw new Error(`Vertical not found: ${key}`);
    }

    return {
      ...vertical,
      capabilities: [...vertical.capabilities],
    };
  }

  createListing(input: IndustryListingRequest): IndustryListing {
    const vertical = INDUSTRY_VERTICALS.find(
      (item) => item.key === input.vertical && item.active,
    );

    if (!vertical) {
      throw new Error(`Active vertical not found: ${input.vertical}`);
    }

    if (!input.sellerId?.trim() || !input.title?.trim()) {
      throw new Error("sellerId and title are required");
    }

    if (input.price <= 0) {
      throw new Error("price must be positive");
    }

    const now = new Date().toISOString();
    const listing: IndustryListing = {
      id: randomUUID(),
      vertical: input.vertical,
      sellerId: input.sellerId,
      title: input.title,
      price: input.price,
      currency: input.currency,
      attributes: { ...input.attributes },
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.listings.set(listing.id, listing);
    return { ...listing, attributes: { ...listing.attributes } };
  }

  publishListing(id: string): IndustryListing {
    const listing = this.requireListing(id);
    listing.status = "PUBLISHED";
    listing.updatedAt = new Date().toISOString();
    this.listings.set(id, listing);
    return { ...listing, attributes: { ...listing.attributes } };
  }

  listingsForVertical(vertical: string): IndustryListing[] {
    this.vertical(vertical);

    return Array.from(this.listings.values())
      .filter((listing) => listing.vertical === vertical)
      .map((listing) => ({
        ...listing,
        attributes: { ...listing.attributes },
      }));
  }

  dashboard() {
    return {
      system: "AVOS Industry Expansion Platform",
      verticals: INDUSTRY_VERTICALS.length,
      activeVerticals: INDUSTRY_VERTICALS.filter((item) => item.active).length,
      listings: this.listings.size,
      publishedListings: Array.from(this.listings.values()).filter(
        (listing) => listing.status === "PUBLISHED",
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireListing(id: string): IndustryListing {
    const listing = this.listings.get(id);

    if (!listing) {
      throw new Error(`Listing not found: ${id}`);
    }

    return listing;
  }
}