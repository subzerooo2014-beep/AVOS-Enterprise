export interface RentalVehicle {
  id: string;
  slug: string;
  title: string;
  category:
    | "economy"
    | "suv"
    | "luxury"
    | "sports"
    | "electric";
  dailyPrice: number;
  monthlyPrice: number;
  deposit: number;
  city: string;
  provider: string;
  rating: number;
  availableNow: boolean;
  deliveryAvailable: boolean;
  image: string;
  features: readonly string[];
}

export const rentalVehicles: readonly RentalVehicle[] = [
  {
    id: "rental-001",
    slug: "range-rover-sport-rental-dubai",
    title: "Range Rover Sport",
    category: "luxury",
    dailyPrice: 1350,
    monthlyPrice: 28500,
    deposit: 5000,
    city: "دبي",
    provider: "AVOS Luxury Rentals",
    rating: 4.9,
    availableNow: true,
    deliveryAvailable: true,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    features: [
      "توصيل مجاني",
      "تأمين شامل",
      "250 كم يوميًا",
    ],
  },
  {
    id: "rental-002",
    slug: "tesla-model-y-rental",
    title: "Tesla Model Y",
    category: "electric",
    dailyPrice: 520,
    monthlyPrice: 10900,
    deposit: 2500,
    city: "دبي",
    provider: "Future Mobility Rentals",
    rating: 4.8,
    availableNow: true,
    deliveryAvailable: true,
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    features: [
      "شحن مجاني",
      "تسليم المطار",
      "200 كم يوميًا",
    ],
  },
  {
    id: "rental-003",
    slug: "toyota-land-cruiser-monthly",
    title: "Toyota Land Cruiser",
    category: "suv",
    dailyPrice: 780,
    monthlyPrice: 16500,
    deposit: 3500,
    city: "أبوظبي",
    provider: "Capital Drive",
    rating: 4.7,
    availableNow: true,
    deliveryAvailable: false,
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
    features: [
      "تأمين شامل",
      "صيانة مشمولة",
      "300 كم يوميًا",
    ],
  },
  {
    id: "rental-004",
    slug: "bmw-m4-weekend-rental",
    title: "BMW M4 Competition",
    category: "sports",
    dailyPrice: 1600,
    monthlyPrice: 34800,
    deposit: 6000,
    city: "دبي",
    provider: "German Performance Rentals",
    rating: 4.9,
    availableNow: false,
    deliveryAvailable: true,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    features: [
      "توصيل فاخر",
      "تأمين شامل",
      "200 كم يوميًا",
    ],
  },
];

export function findRentalBySlug(
  slug: string,
): RentalVehicle | undefined {
  return rentalVehicles.find(
    (rental) => rental.slug === slug,
  );
}
