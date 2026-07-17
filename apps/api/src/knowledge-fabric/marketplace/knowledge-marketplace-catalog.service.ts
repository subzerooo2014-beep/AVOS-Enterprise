import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeMarketplaceListing, KnowledgeMarketplaceSearchQuery } from "./knowledge-marketplace.types";

@Injectable()
export class KnowledgeMarketplaceCatalogService {
  private readonly listings = new Map<string, KnowledgeMarketplaceListing>();

  createListing(input: Omit<KnowledgeMarketplaceListing, "id" | "state" | "createdAt" | "updatedAt">): KnowledgeMarketplaceListing {
    const now = new Date().toISOString();
    const listing: KnowledgeMarketplaceListing = { ...input, id: randomUUID(), state: "DRAFT", createdAt: now, updatedAt: now };
    this.listings.set(listing.id, listing);
    return structuredClone(listing);
  }

  publishListing(id: string): KnowledgeMarketplaceListing {
    const listing = this.require(id);
    listing.state = "PUBLISHED";
    listing.updatedAt = new Date().toISOString();
    return structuredClone(listing);
  }

  suspendListing(id: string): KnowledgeMarketplaceListing {
    const listing = this.require(id);
    listing.state = "SUSPENDED";
    listing.updatedAt = new Date().toISOString();
    return structuredClone(listing);
  }

  getListing(id: string): KnowledgeMarketplaceListing { return structuredClone(this.require(id)); }
  listListings(): KnowledgeMarketplaceListing[] { return [...this.listings.values()].map((item) => structuredClone(item)); }

  search(query: KnowledgeMarketplaceSearchQuery): KnowledgeMarketplaceListing[] {
    const text = query.text?.trim().toLowerCase();
    return this.listListings().filter((listing) => {
      if (listing.state !== "PUBLISHED") return false;
      if (text && !`${listing.title} ${listing.description} ${listing.tags.join(" ")}`.toLowerCase().includes(text)) return false;
      if (query.category && !listing.categories.includes(query.category)) return false;
      if (query.tags?.length && !query.tags.every((tag) => listing.tags.includes(tag))) return false;
      if (query.ownerId && listing.ownerId !== query.ownerId) return false;
      if (query.licenseType && listing.licenseType !== query.licenseType) return false;
      if (query.maxPrice !== undefined && listing.price > query.maxPrice) return false;
      return true;
    });
  }

  private require(id: string): KnowledgeMarketplaceListing {
    const listing = this.listings.get(id);
    if (!listing) throw new NotFoundException(`Marketplace listing ${id} was not found.`);
    return listing;
  }
}