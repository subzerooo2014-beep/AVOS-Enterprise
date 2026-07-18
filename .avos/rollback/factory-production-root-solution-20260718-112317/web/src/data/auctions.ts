export interface AuctionListing {
  id: string;
  slug: string;
  title: string;
  category: "vehicle" | "plate";
  image: string;
  currentBid: number;
  reservePrice: number;
  bids: number;
  endsAt: string;
  city: string;
  verified: boolean;
  autoBidEnabled: boolean;
  seller: string;
}

export const auctionListings: readonly AuctionListing[] = [
  {
    id: "auction-001",
    slug: "g63-amg-2024-live-auction",
    title: "Mercedes-Benz G63 AMG 2024",
    category: "vehicle",
    image:
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
    currentBid: 684000,
    reservePrice: 710000,
    bids: 38,
    endsAt: "2026-07-16T20:00:00.000Z",
    city: "دبي",
    verified: true,
    autoBidEnabled: true,
    seller: "AVOS Premium Auctions",
  },
  {
    id: "auction-002",
    slug: "dubai-aa-7-plate-auction",
    title: "لوحة دبي AA 7",
    category: "plate",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    currentBid: 21800000,
    reservePrice: 22500000,
    bids: 91,
    endsAt: "2026-07-17T21:30:00.000Z",
    city: "دبي",
    verified: true,
    autoBidEnabled: true,
    seller: "AVOS Signature Numbers",
  },
  {
    id: "auction-003",
    slug: "porsche-cayenne-s-2022-auction",
    title: "Porsche Cayenne S 2022",
    category: "vehicle",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    currentBid: 262000,
    reservePrice: 280000,
    bids: 24,
    endsAt: "2026-07-15T19:45:00.000Z",
    city: "أبوظبي",
    verified: true,
    autoBidEnabled: true,
    seller: "Capital Elite Auctions",
  },
  {
    id: "auction-004",
    slug: "lexus-lx600-vip-auction",
    title: "Lexus LX 600 VIP 2024",
    category: "vehicle",
    image:
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    currentBid: 498000,
    reservePrice: 520000,
    bids: 42,
    endsAt: "2026-07-18T18:00:00.000Z",
    city: "دبي",
    verified: true,
    autoBidEnabled: false,
    seller: "AVOS Premium Auctions",
  },
];

export function findAuctionBySlug(
  slug: string,
): AuctionListing | undefined {
  return auctionListings.find(
    (auction) => auction.slug === slug,
  );
}
