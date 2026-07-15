import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  MarketplaceBooking,
  MarketplaceDashboard,
  MarketplaceDeal,
  MarketplaceMessage,
  MarketplaceOffer,
  MarketplaceReview,
  SubscriptionPlan,
  VehicleListing,
} from "./business-launch.types";

@Injectable()
export class BusinessLaunchService {
  private readonly listings = new Map<string, VehicleListing>();
  private readonly offers = new Map<string, MarketplaceOffer>();
  private readonly bookings = new Map<string, MarketplaceBooking>();
  private readonly messages = new Map<string, MarketplaceMessage>();
  private readonly deals = new Map<string, MarketplaceDeal>();
  private readonly reviews = new Map<string, MarketplaceReview>();
  private readonly subscriptions = new Map<string, SubscriptionPlan>();

  constructor() {
    for (const plan of this.defaultPlans()) {
      this.subscriptions.set(plan.id, plan);
    }
  }

  createListing(
    input: Omit<VehicleListing, "id" | "status" | "createdAt" | "updatedAt">,
  ): VehicleListing {
    if (!input.sellerId?.trim()) {
      throw new Error("sellerId is required");
    }

    if (!input.title?.trim() || !input.make?.trim() || !input.model?.trim()) {
      throw new Error("title, make and model are required");
    }

    if (input.year < 1900 || input.price <= 0 || input.mileage < 0) {
      throw new Error("Invalid listing values");
    }

    const now = new Date().toISOString();
    const listing: VehicleListing = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      media: [...input.media],
      createdAt: now,
      updatedAt: now,
    };

    this.listings.set(listing.id, listing);
    return this.cloneListing(listing);
  }

  publishListing(id: string): VehicleListing {
    const listing = this.requireListing(id);
    listing.status = "PUBLISHED";
    listing.updatedAt = new Date().toISOString();
    this.listings.set(id, listing);
    return this.cloneListing(listing);
  }

  listListings(query?: string): VehicleListing[] {
    const normalized = query?.trim().toLowerCase();

    return Array.from(this.listings.values())
      .filter((listing) => {
        if (!normalized) return true;
        return [
          listing.title,
          listing.make,
          listing.model,
          listing.currency,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      })
      .map((listing) => this.cloneListing(listing));
  }

  compareListings(ids: string[]): VehicleListing[] {
    if (ids.length < 2) {
      throw new Error("At least two listing ids are required");
    }

    return ids.map((id) => this.cloneListing(this.requireListing(id)));
  }

  createOffer(
    input: Omit<MarketplaceOffer, "id" | "status" | "createdAt">,
  ): MarketplaceOffer {
    const listing = this.requireListing(input.listingId);

    if (listing.status !== "PUBLISHED") {
      throw new Error("Offers require a published listing");
    }

    if (input.amount <= 0) {
      throw new Error("Offer amount must be positive");
    }

    const offer: MarketplaceOffer = {
      ...input,
      id: randomUUID(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.offers.set(offer.id, offer);
    return { ...offer };
  }

  acceptOffer(id: string): MarketplaceDeal {
    const offer = this.offers.get(id);

    if (!offer) {
      throw new Error(`Offer not found: ${id}`);
    }

    if (offer.status !== "PENDING") {
      throw new Error("Only pending offers can be accepted");
    }

    const listing = this.requireListing(offer.listingId);
    offer.status = "ACCEPTED";
    this.offers.set(offer.id, offer);

    listing.status = "RESERVED";
    listing.updatedAt = new Date().toISOString();
    this.listings.set(listing.id, listing);

    const now = new Date().toISOString();
    const deal: MarketplaceDeal = {
      id: randomUUID(),
      listingId: listing.id,
      buyerId: offer.buyerId,
      sellerId: listing.sellerId,
      offerId: offer.id,
      status: "AGREED",
      agreedPrice: offer.amount,
      currency: offer.currency,
      createdAt: now,
      updatedAt: now,
    };

    this.deals.set(deal.id, deal);
    return { ...deal };
  }

  createBooking(
    input: Omit<MarketplaceBooking, "id" | "status" | "createdAt">,
  ): MarketplaceBooking {
    const listing = this.requireListing(input.listingId);

    if (listing.status !== "PUBLISHED") {
      throw new Error("Bookings require a published listing");
    }

    const booking: MarketplaceBooking = {
      ...input,
      id: randomUUID(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(booking.id, booking);
    return { ...booking };
  }

  confirmBooking(id: string): MarketplaceBooking {
    const booking = this.bookings.get(id);

    if (!booking) {
      throw new Error(`Booking not found: ${id}`);
    }

    booking.status = "CONFIRMED";
    this.bookings.set(id, booking);
    return { ...booking };
  }

  sendMessage(
    input: Omit<MarketplaceMessage, "id" | "createdAt">,
  ): MarketplaceMessage {
    this.requireListing(input.listingId);

    if (!input.body?.trim()) {
      throw new Error("Message body is required");
    }

    const message: MarketplaceMessage = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.messages.set(message.id, message);
    return { ...message };
  }

  completeDeal(id: string): MarketplaceDeal {
    const deal = this.deals.get(id);

    if (!deal) {
      throw new Error(`Deal not found: ${id}`);
    }

    deal.status = "CLOSED";
    deal.updatedAt = new Date().toISOString();
    this.deals.set(id, deal);

    const listing = this.requireListing(deal.listingId);
    listing.status = "SOLD";
    listing.updatedAt = new Date().toISOString();
    this.listings.set(listing.id, listing);

    return { ...deal };
  }

  createReview(
    input: Omit<MarketplaceReview, "id" | "createdAt">,
  ): MarketplaceReview {
    const deal = this.deals.get(input.dealId);

    if (!deal || deal.status !== "CLOSED") {
      throw new Error("Reviews require a closed deal");
    }

    if (input.rating < 1 || input.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const review: MarketplaceReview = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.reviews.set(review.id, review);
    return { ...review };
  }

  plans(): SubscriptionPlan[] {
    return Array.from(this.subscriptions.values()).map((plan) => ({ ...plan }));
  }

  dashboard(): MarketplaceDashboard {
    const listings = Array.from(this.listings.values());
    const deals = Array.from(this.deals.values());

    return {
      listings: listings.length,
      publishedListings: listings.filter(
        (listing) => listing.status === "PUBLISHED",
      ).length,
      offers: this.offers.size,
      bookings: this.bookings.size,
      deals: deals.length,
      closedDeals: deals.filter((deal) => deal.status === "CLOSED").length,
      messages: this.messages.size,
      reviews: this.reviews.size,
      subscriptions: this.subscriptions.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireListing(id: string): VehicleListing {
    const listing = this.listings.get(id);

    if (!listing) {
      throw new Error(`Listing not found: ${id}`);
    }

    return listing;
  }

  private cloneListing(listing: VehicleListing): VehicleListing {
    return {
      ...listing,
      media: [...listing.media],
    };
  }

  private defaultPlans(): SubscriptionPlan[] {
    return [
      {
        id: "free",
        code: "FREE",
        monthlyPrice: 0,
        currency: "AED",
        listingLimit: 2,
        featuredListings: 0,
      },
      {
        id: "pro",
        code: "PRO",
        monthlyPrice: 199,
        currency: "AED",
        listingLimit: 50,
        featuredListings: 5,
      },
      {
        id: "premium",
        code: "PREMIUM",
        monthlyPrice: 499,
        currency: "AED",
        listingLimit: 500,
        featuredListings: 25,
      },
    ];
  }
}