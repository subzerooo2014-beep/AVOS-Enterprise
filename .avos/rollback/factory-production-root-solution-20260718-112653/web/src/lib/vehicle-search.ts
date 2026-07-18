import {
  Vehicle,
  VehicleBody,
  VehicleCondition,
  VehicleFuel,
  VehicleTransmission,
} from "@/data/vehicles";

export interface VehicleSearchFilters {
  query: string;
  brand: string;
  city: string;
  condition: VehicleCondition | "";
  fuel: VehicleFuel | "";
  transmission: VehicleTransmission | "";
  body: VehicleBody | "";
  minYear: number | null;
  maxPrice: number | null;
  sort:
    | "newest"
    | "price-asc"
    | "price-desc"
    | "mileage-asc";
}

export const defaultVehicleFilters: VehicleSearchFilters = {
  query: "",
  brand: "",
  city: "",
  condition: "",
  fuel: "",
  transmission: "",
  body: "",
  minYear: null,
  maxPrice: null,
  sort: "newest",
};

export function filterVehicles(
  vehicles: readonly Vehicle[],
  filters: VehicleSearchFilters,
): Vehicle[] {
  const query = filters.query.trim().toLowerCase();

  const result = vehicles.filter((vehicle) => {
    const searchable = [
      vehicle.title,
      vehicle.brand,
      vehicle.model,
      vehicle.city,
      vehicle.dealer,
      String(vehicle.year),
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!filters.brand || vehicle.brand === filters.brand) &&
      (!filters.city || vehicle.city === filters.city) &&
      (!filters.condition ||
        vehicle.condition === filters.condition) &&
      (!filters.fuel || vehicle.fuel === filters.fuel) &&
      (!filters.transmission ||
        vehicle.transmission === filters.transmission) &&
      (!filters.body || vehicle.body === filters.body) &&
      (filters.minYear === null ||
        vehicle.year >= filters.minYear) &&
      (filters.maxPrice === null ||
        vehicle.price <= filters.maxPrice)
    );
  });

  return result.sort((left, right) => {
    switch (filters.sort) {
      case "price-asc":
        return left.price - right.price;
      case "price-desc":
        return right.price - left.price;
      case "mileage-asc":
        return left.mileage - right.mileage;
      case "newest":
      default:
        return (
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()
        );
    }
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-AE").format(price);
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("ar-AE").format(mileage);
}
