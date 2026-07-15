export type ListingStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "RESERVED"
  | "SOLD"
  | "ARCHIVED";

export type OfferStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type DealStatus =
  | "OPEN"
  | "AGREED"
  | "PAID"
  | "DELIVERED"
  | "CLOSED"
  | "CANCELLED";

export interface VehicleListing {
  id: string;
  sellerId: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  status: ListingStatus;
  media: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceOffer {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  currency: string;
  status: OfferStatus;
  createdAt: string;
}

export interface MarketplaceBooking {
  id: string;
  listingId: string;
  buyerId: string;
  scheduledAt: string;
  status: BookingStatus;
  createdAt: string;
}

export interface MarketplaceMessage {
  id: string;
  listingId: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
}

export interface MarketplaceDeal {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  offerId?: string;
  bookingId?: string;
  status: DealStatus;
  agreedPrice: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceReview {
  id: string;
  dealId: string;
  reviewerId: string;
  subjectId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  code: "FREE" | "PRO" | "PREMIUM";
  monthlyPrice: number;
  currency: string;
  listingLimit: number;
  featuredListings: number;
}

export interface MarketplaceDashboard {
  listings: number;
  publishedListings: number;
  offers: number;
  bookings: number;
  deals: number;
  closedDeals: number;
  messages: number;
  reviews: number;
  subscriptions: number;
  generatedAt: string;
}