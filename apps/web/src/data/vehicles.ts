export type VehicleCondition = "new" | "used";
export type VehicleFuel = "petrol" | "diesel" | "hybrid" | "electric";
export type VehicleTransmission = "automatic" | "manual";
export type VehicleBody =
  | "suv"
  | "sedan"
  | "coupe"
  | "pickup"
  | "hatchback"
  | "van";

export interface Vehicle {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  city: string;
  condition: VehicleCondition;
  fuel: VehicleFuel;
  transmission: VehicleTransmission;
  body: VehicleBody;
  color: string;
  featured: boolean;
  verified: boolean;
  dealer: string;
  image: string;
  gallery: readonly string[];
  description: string;
  specs: Readonly<Record<string, string>>;
  createdAt: string;
}

export const vehicles: readonly Vehicle[] = [
  {
    id: "veh-001",
    slug: "range-rover-sport-2025-hse",
    title: "Range Rover Sport HSE",
    brand: "Land Rover",
    model: "Range Rover Sport",
    year: 2025,
    price: 365000,
    mileage: 1200,
    city: "دبي",
    condition: "used",
    fuel: "petrol",
    transmission: "automatic",
    body: "suv",
    color: "أسود",
    featured: true,
    verified: true,
    dealer: "AVOS Premium Motors",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85",
    ],
    description:
      "سيارة فاخرة بحالة ممتازة، ضمان وكالة، سجل صيانة كامل، ومواصفات خليجية.",
    specs: {
      المحرك: "3.0L Turbo",
      القوة: "395 حصان",
      المقاعد: "5",
      الدفع: "رباعي",
      الضمان: "حتى 2029",
      المنشأ: "خليجي",
    },
    createdAt: "2026-07-10T10:00:00.000Z",
  },
  {
    id: "veh-002",
    slug: "mercedes-benz-g63-2024",
    title: "Mercedes-Benz G63 AMG",
    brand: "Mercedes-Benz",
    model: "G63 AMG",
    year: 2024,
    price: 729000,
    mileage: 6800,
    city: "أبوظبي",
    condition: "used",
    fuel: "petrol",
    transmission: "automatic",
    body: "suv",
    color: "رمادي",
    featured: true,
    verified: true,
    dealer: "Capital Elite Cars",
    image:
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85",
    ],
    description:
      "G63 AMG بمواصفات كاملة، داخلية حمراء، حماية كاملة، وضمان ساري.",
    specs: {
      المحرك: "4.0L V8 Bi-Turbo",
      القوة: "577 حصان",
      المقاعد: "5",
      الدفع: "رباعي",
      الضمان: "حتى 2028",
      المنشأ: "خليجي",
    },
    createdAt: "2026-07-09T10:00:00.000Z",
  },
  {
    id: "veh-003",
    slug: "toyota-land-cruiser-2025-vxr",
    title: "Toyota Land Cruiser VXR",
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2025,
    price: 389000,
    mileage: 0,
    city: "دبي",
    condition: "new",
    fuel: "petrol",
    transmission: "automatic",
    body: "suv",
    color: "أبيض",
    featured: true,
    verified: true,
    dealer: "Emirates Auto Hub",
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=85",
    ],
    description:
      "لاندكروزر جديد كليًا، تسليم فوري، ضمان وكالة ومواصفات خليجية.",
    specs: {
      المحرك: "3.5L Twin Turbo",
      القوة: "409 حصان",
      المقاعد: "7",
      الدفع: "رباعي",
      الضمان: "5 سنوات",
      المنشأ: "خليجي",
    },
    createdAt: "2026-07-08T10:00:00.000Z",
  },
  {
    id: "veh-004",
    slug: "bmw-m4-competition-2023",
    title: "BMW M4 Competition",
    brand: "BMW",
    model: "M4",
    year: 2023,
    price: 315000,
    mileage: 21000,
    city: "الشارقة",
    condition: "used",
    fuel: "petrol",
    transmission: "automatic",
    body: "coupe",
    color: "أزرق",
    featured: false,
    verified: true,
    dealer: "German Performance Center",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1600&q=85",
    ],
    description:
      "M4 Competition بحالة ممتازة، صيانة وكالة، لون مميز ومواصفات كاملة.",
    specs: {
      المحرك: "3.0L Twin Turbo",
      القوة: "503 حصان",
      المقاعد: "4",
      الدفع: "خلفي",
      الضمان: "ساري",
      المنشأ: "خليجي",
    },
    createdAt: "2026-07-07T10:00:00.000Z",
  },
  {
    id: "veh-005",
    slug: "tesla-model-y-long-range-2024",
    title: "Tesla Model Y Long Range",
    brand: "Tesla",
    model: "Model Y",
    year: 2024,
    price: 179000,
    mileage: 14500,
    city: "دبي",
    condition: "used",
    fuel: "electric",
    transmission: "automatic",
    body: "suv",
    color: "أبيض",
    featured: false,
    verified: true,
    dealer: "Future Mobility",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=85",
    ],
    description:
      "موديل Y بمدى طويل، شحن سريع، نظام قيادة متقدم وحالة ممتازة.",
    specs: {
      المدى: "533 كم",
      التسارع: "5.0 ث",
      المقاعد: "5",
      الدفع: "رباعي",
      الضمان: "بطارية 8 سنوات",
      المنشأ: "أمريكي",
    },
    createdAt: "2026-07-06T10:00:00.000Z",
  },
  {
    id: "veh-006",
    slug: "porsche-cayenne-s-2022",
    title: "Porsche Cayenne S",
    brand: "Porsche",
    model: "Cayenne",
    year: 2022,
    price: 289000,
    mileage: 34000,
    city: "أبوظبي",
    condition: "used",
    fuel: "petrol",
    transmission: "automatic",
    body: "suv",
    color: "أسود",
    featured: false,
    verified: true,
    dealer: "Capital Elite Cars",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1600&q=85",
    ],
    description:
      "بورش كايين S بمواصفات عالية وسجل صيانة منتظم وحالة نظيفة.",
    specs: {
      المحرك: "2.9L V6 Twin Turbo",
      القوة: "434 حصان",
      المقاعد: "5",
      الدفع: "رباعي",
      الضمان: "متاح",
      المنشأ: "خليجي",
    },
    createdAt: "2026-07-05T10:00:00.000Z",
  },
  {
    id: "veh-007",
    slug: "ford-f150-raptor-2023",
    title: "Ford F-150 Raptor",
    brand: "Ford",
    model: "F-150 Raptor",
    year: 2023,
    price: 305000,
    mileage: 26000,
    city: "العين",
    condition: "used",
    fuel: "petrol",
    transmission: "automatic",
    body: "pickup",
    color: "برتقالي",
    featured: false,
    verified: true,
    dealer: "Desert Performance",
    image:
      "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85",
    ],
    description:
      "رابتور جاهز للبر والمدينة، إضافات أصلية، صيانة كاملة وحالة ممتازة.",
    specs: {
      المحرك: "3.5L EcoBoost",
      القوة: "450 حصان",
      المقاعد: "5",
      الدفع: "رباعي",
      الضمان: "ساري",
      المنشأ: "خليجي",
    },
    createdAt: "2026-07-04T10:00:00.000Z",
  },
  {
    id: "veh-008",
    slug: "lexus-lx600-2024",
    title: "Lexus LX 600 VIP",
    brand: "Lexus",
    model: "LX 600",
    year: 2024,
    price: 535000,
    mileage: 9000,
    city: "دبي",
    condition: "used",
    fuel: "petrol",
    transmission: "automatic",
    body: "suv",
    color: "أبيض لؤلؤي",
    featured: true,
    verified: true,
    dealer: "AVOS Premium Motors",
    image:
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?auto=format&fit=crop&w=1600&q=85",
    ],
    description:
      "LX 600 VIP فئة رجال الأعمال، مقاعد خلفية فاخرة وضمان وكالة.",
    specs: {
      المحرك: "3.5L Twin Turbo",
      القوة: "409 حصان",
      المقاعد: "4",
      الدفع: "رباعي",
      الضمان: "حتى 2028",
      المنشأ: "خليجي",
    },
    createdAt: "2026-07-03T10:00:00.000Z",
  },
];

export const vehicleBrands = [
  ...new Set(vehicles.map((vehicle) => vehicle.brand)),
].sort();

export const vehicleCities = [
  ...new Set(vehicles.map((vehicle) => vehicle.city)),
].sort();

export function findVehicleBySlug(
  slug: string,
): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}
