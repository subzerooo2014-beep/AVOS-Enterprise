export interface AutoPart {
  id: string;
  slug: string;
  title: string;
  brand: string;
  condition: "new" | "used" | "refurbished";
  category:
    | "engine"
    | "brakes"
    | "suspension"
    | "body"
    | "electronics"
    | "wheels";
  price: number;
  stock: number;
  compatibleVehicles: readonly string[];
  seller: string;
  city: string;
  verified: boolean;
  image: string;
}

export const autoParts: readonly AutoPart[] = [
  {
    id: "part-001",
    slug: "brembo-gt-brake-kit",
    title: "Brembo GT Brake Kit",
    brand: "Brembo",
    condition: "new",
    category: "brakes",
    price: 14800,
    stock: 6,
    compatibleVehicles: [
      "BMW M4",
      "BMW M3",
    ],
    seller: "German Performance Center",
    city: "دبي",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "part-002",
    slug: "land-cruiser-alloy-wheels",
    title: "جنوط لاندكروزر أصلية 20 إنش",
    brand: "Toyota",
    condition: "new",
    category: "wheels",
    price: 9200,
    stock: 10,
    compatibleVehicles: [
      "Toyota Land Cruiser 2022-2026",
    ],
    seller: "Emirates Parts Hub",
    city: "الشارقة",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "part-003",
    slug: "range-rover-air-suspension",
    title: "نظام تعليق هوائي Range Rover",
    brand: "Land Rover",
    condition: "refurbished",
    category: "suspension",
    price: 6800,
    stock: 4,
    compatibleVehicles: [
      "Range Rover Sport 2020-2025",
    ],
    seller: "British Auto Parts UAE",
    city: "دبي",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "part-004",
    slug: "tesla-model-y-screen",
    title: "شاشة Tesla Model Y أصلية",
    brand: "Tesla",
    condition: "used",
    category: "electronics",
    price: 4200,
    stock: 2,
    compatibleVehicles: [
      "Tesla Model Y 2021-2025",
    ],
    seller: "EV Parts Emirates",
    city: "أبوظبي",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
  },
];

export function findPartBySlug(
  slug: string,
): AutoPart | undefined {
  return autoParts.find(
    (part) => part.slug === slug,
  );
}
