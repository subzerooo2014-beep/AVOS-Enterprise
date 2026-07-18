import { vehicles } from "@/data/vehicles";
import { plateListings } from "@/data/plates";
import { automotiveServices } from "@/data/services";
import { auctionListings } from "@/data/auctions";
import { autoParts } from "@/data/parts";
import { rentalVehicles } from "@/data/rentals";

export type GlobalSearchType =
  | "vehicle"
  | "plate"
  | "service"
  | "auction"
  | "part"
  | "rental";

export interface GlobalSearchResult {
  id: string;
  type: GlobalSearchType;
  title: string;
  subtitle: string;
  image?: string;
  href: string;
  score: number;
}

export function globalSearch(
  query: string,
): readonly GlobalSearchResult[] {
  const normalized =
    query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const results: GlobalSearchResult[] = [];

  for (const vehicle of vehicles) {
    const text = [
      vehicle.title,
      vehicle.brand,
      vehicle.model,
      vehicle.city,
    ]
      .join(" ")
      .toLowerCase();

    if (text.includes(normalized)) {
      results.push({
        id: vehicle.id,
        type: "vehicle",
        title: vehicle.title,
        subtitle: `${vehicle.year} · ${vehicle.city}`,
        image: vehicle.image,
        href: `/vehicles/${vehicle.slug}`,
        score: 96,
      });
    }
  }

  for (const plate of plateListings) {
    const text = [
      plate.emirate,
      plate.code,
      plate.number,
    ]
      .join(" ")
      .toLowerCase();

    if (text.includes(normalized)) {
      results.push({
        id: plate.id,
        type: "plate",
        title:
          `${plate.emirate} ${plate.code} ${plate.number}`,
        subtitle: "رقم مميز",
        href: "/plates",
        score: 92,
      });
    }
  }

  for (const service of automotiveServices) {
    const text = [
      service.title,
      service.providerName,
      service.city,
    ]
      .join(" ")
      .toLowerCase();

    if (text.includes(normalized)) {
      results.push({
        id: service.id,
        type: "service",
        title: service.title,
        subtitle: service.providerName,
        image: service.image,
        href: `/services/${service.slug}`,
        score: 90,
      });
    }
  }

  for (const auction of auctionListings) {
    if (
      auction.title
        .toLowerCase()
        .includes(normalized)
    ) {
      results.push({
        id: auction.id,
        type: "auction",
        title: auction.title,
        subtitle: `${auction.bids} مزايدة`,
        image: auction.image,
        href: `/auctions/${auction.slug}`,
        score: 94,
      });
    }
  }

  for (const part of autoParts) {
    const text = [
      part.title,
      part.brand,
      ...part.compatibleVehicles,
    ]
      .join(" ")
      .toLowerCase();

    if (text.includes(normalized)) {
      results.push({
        id: part.id,
        type: "part",
        title: part.title,
        subtitle: part.seller,
        image: part.image,
        href: `/parts/${part.slug}`,
        score: 88,
      });
    }
  }

  for (const rental of rentalVehicles) {
    const text = [
      rental.title,
      rental.city,
      rental.provider,
    ]
      .join(" ")
      .toLowerCase();

    if (text.includes(normalized)) {
      results.push({
        id: rental.id,
        type: "rental",
        title: rental.title,
        subtitle: rental.provider,
        image: rental.image,
        href: `/rentals/${rental.slug}`,
        score: 91,
      });
    }
  }

  return results
    .sort(
      (left, right) =>
        right.score - left.score,
    )
    .slice(0, 24);
}
