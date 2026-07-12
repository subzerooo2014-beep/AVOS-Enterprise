export type ServiceCategory =
  | "inspection"
  | "maintenance"
  | "insurance"
  | "finance"
  | "transport"
  | "detailing"
  | "warranty"
  | "parts";

export type ServiceSort =
  | "recommended"
  | "rating"
  | "price-low"
  | "response";

export interface AutomotiveService {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  providerId: string;
  providerName: string;
  city: string;
  priceFrom: number;
  rating: number;
  reviews: number;
  verified: boolean;
  mobileService: boolean;
  homeService: boolean;
  instantBooking: boolean;
  openNow: boolean;
  responseMinutes: number;
  estimatedDurationMinutes: number;
  distanceKm: number;
  aiMatchScore: number;
  promoted: boolean;
  discountPercent: number;
  image: string;
  description: string;
  highlights: readonly string[];
}

export const automotiveServices: readonly AutomotiveService[] = [
  {
    id: "service-001",
    slug: "avos-comprehensive-inspection",
    title: "فحص AVOS الشامل قبل الشراء",
    category: "inspection",
    providerId: "provider-001",
    providerName: "AVOS Inspection Center",
    city: "دبي",
    priceFrom: 499,
    rating: 4.9,
    reviews: 842,
    verified: true,
    mobileService: true,
    homeService: true,
    instantBooking: true,
    openNow: true,
    responseMinutes: 4,
    estimatedDurationMinutes: 75,
    distanceKm: 3.2,
    aiMatchScore: 98,
    promoted: true,
    discountPercent: 12,
    image:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
    description:
      "فحص شامل للهيكل والمحرك والقير والإلكترونيات مع تقرير ذكي وتقييم مخاطر.",
    highlights: [
      "أكثر من 180 نقطة فحص",
      "كشف الحوادث والدهان",
      "تقرير رقمي فوري",
      "توصية شراء من AVOS",
    ],
  },
  {
    id: "service-002",
    slug: "premium-car-detailing",
    title: "تلميع وحماية سيراميك",
    category: "detailing",
    providerId: "provider-002",
    providerName: "Elite Auto Spa",
    city: "أبوظبي",
    priceFrom: 850,
    rating: 4.8,
    reviews: 316,
    verified: true,
    mobileService: false,
    homeService: false,
    instantBooking: true,
    openNow: true,
    responseMinutes: 8,
    estimatedDurationMinutes: 240,
    distanceKm: 7.8,
    aiMatchScore: 94,
    promoted: true,
    discountPercent: 15,
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80",
    description:
      "تلميع احترافي وحماية سيراميك متعددة الطبقات مع ضمان حتى 3 سنوات.",
    highlights: [
      "معالجة خدوش سطحية",
      "طلاء سيراميك",
      "تنظيف داخلي",
      "ضمان موثق",
    ],
  },
  {
    id: "service-003",
    slug: "mobile-maintenance-package",
    title: "صيانة دورية متنقلة",
    category: "maintenance",
    providerId: "provider-003",
    providerName: "Mobile Mechanic UAE",
    city: "دبي",
    priceFrom: 299,
    rating: 4.7,
    reviews: 511,
    verified: true,
    mobileService: true,
    homeService: true,
    instantBooking: true,
    openNow: true,
    responseMinutes: 12,
    estimatedDurationMinutes: 90,
    distanceKm: 4.5,
    aiMatchScore: 96,
    promoted: false,
    discountPercent: 8,
    image:
      "https://images.unsplash.com/photo-1632823471565-1ecdf5c6d7a8?auto=format&fit=crop&w=1200&q=80",
    description:
      "صيانة دورية في موقعك تشمل الزيوت والفلاتر والفحص العام.",
    highlights: [
      "زيارة إلى موقعك",
      "قطع أصلية",
      "تقرير حالة",
      "ضمان الخدمة",
    ],
  },
  {
    id: "service-004",
    slug: "vehicle-transport-uae",
    title: "نقل السيارات داخل الإمارات",
    category: "transport",
    providerId: "provider-004",
    providerName: "Emirates Vehicle Logistics",
    city: "الشارقة",
    priceFrom: 250,
    rating: 4.8,
    reviews: 204,
    verified: true,
    mobileService: true,
    homeService: true,
    instantBooking: false,
    openNow: true,
    responseMinutes: 15,
    estimatedDurationMinutes: 180,
    distanceKm: 11.2,
    aiMatchScore: 90,
    promoted: false,
    discountPercent: 0,
    image:
      "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=1200&q=80",
    description:
      "نقل آمن ومؤمن للسيارات بين جميع إمارات الدولة.",
    highlights: [
      "تغطية شاملة",
      "تتبع مباشر",
      "تأمين أثناء النقل",
      "تسليم موثق",
    ],
  },
  {
    id: "service-005",
    slug: "extended-warranty-plan",
    title: "ضمان ممتد للسيارات المستعملة",
    category: "warranty",
    providerId: "provider-005",
    providerName: "AVOS Warranty Network",
    city: "الإمارات",
    priceFrom: 2400,
    rating: 4.6,
    reviews: 178,
    verified: true,
    mobileService: false,
    homeService: false,
    instantBooking: false,
    openNow: true,
    responseMinutes: 20,
    estimatedDurationMinutes: 30,
    distanceKm: 0,
    aiMatchScore: 87,
    promoted: false,
    discountPercent: 5,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    description:
      "خطط ضمان تغطي المحرك والقير والأنظمة الكهربائية حتى 3 سنوات.",
    highlights: [
      "شبكة ورش معتمدة",
      "مطالبات رقمية",
      "خطط مرنة",
      "دعم 24/7",
    ],
  },
  {
    id: "service-006",
    slug: "insurance-comparison",
    title: "مقارنة تأمين المركبات",
    category: "insurance",
    providerId: "provider-006",
    providerName: "AVOS Insurance Hub",
    city: "الإمارات",
    priceFrom: 1200,
    rating: 4.8,
    reviews: 620,
    verified: true,
    mobileService: false,
    homeService: false,
    instantBooking: true,
    openNow: true,
    responseMinutes: 3,
    estimatedDurationMinutes: 15,
    distanceKm: 0,
    aiMatchScore: 95,
    promoted: true,
    discountPercent: 10,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    description:
      "قارن عروض التأمين الشامل والطرف الثالث من مزودين معتمدين.",
    highlights: [
      "مقارنة فورية",
      "خصومات حصرية",
      "إصدار إلكتروني",
      "دعم المطالبات",
    ],
  },
  {
    id: "service-007",
    slug: "battery-rescue-mobile",
    title: "بطارية وإنقاذ متنقل 24/7",
    category: "maintenance",
    providerId: "provider-007",
    providerName: "Rapid Battery UAE",
    city: "أبوظبي",
    priceFrom: 180,
    rating: 4.9,
    reviews: 933,
    verified: true,
    mobileService: true,
    homeService: true,
    instantBooking: true,
    openNow: true,
    responseMinutes: 9,
    estimatedDurationMinutes: 35,
    distanceKm: 2.1,
    aiMatchScore: 97,
    promoted: true,
    discountPercent: 7,
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
    description:
      "فحص البطارية والدينمو واستبدال فوري في موقعك مع ضمان مكتوب.",
    highlights: [
      "وصول سريع",
      "فحص مجاني",
      "بطاريات أصلية",
      "ضمان حتى سنتين",
    ],
  },
  {
    id: "service-008",
    slug: "smart-auto-finance",
    title: "تمويل ذكي للسيارات",
    category: "finance",
    providerId: "provider-008",
    providerName: "AVOS Finance Desk",
    city: "الإمارات",
    priceFrom: 0,
    rating: 4.7,
    reviews: 404,
    verified: true,
    mobileService: false,
    homeService: false,
    instantBooking: true,
    openNow: true,
    responseMinutes: 6,
    estimatedDurationMinutes: 20,
    distanceKm: 0,
    aiMatchScore: 92,
    promoted: false,
    discountPercent: 0,
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80",
    description:
      "قارن حلول التمويل واحصل على موافقة مبدئية من عدة جهات خلال دقائق.",
    highlights: [
      "مقارنة بنوك",
      "حسبة شهرية",
      "موافقة مبدئية",
      "ملف رقمي موحد",
    ],
  },
  {
    id: "service-009",
    slug: "original-parts-fitment",
    title: "قطع غيار أصلية مع فحص توافق",
    category: "parts",
    providerId: "provider-009",
    providerName: "AVOS Parts Network",
    city: "دبي",
    priceFrom: 95,
    rating: 4.8,
    reviews: 728,
    verified: true,
    mobileService: true,
    homeService: true,
    instantBooking: true,
    openNow: false,
    responseMinutes: 14,
    estimatedDurationMinutes: 60,
    distanceKm: 6.4,
    aiMatchScore: 91,
    promoted: false,
    discountPercent: 6,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
    description:
      "اختيار القطعة الصحيحة حسب رقم الهيكل مع تركيب وضمان من مزودين معتمدين.",
    highlights: [
      "مطابقة VIN",
      "خيارات أصلية وبديلة",
      "تركيب معتمد",
      "ضمان القطعة",
    ],
  },
];

export const serviceCategoryLabels: Readonly<
  Record<ServiceCategory, string>
> = {
  inspection: "الفحص",
  maintenance: "الصيانة",
  insurance: "التأمين",
  finance: "التمويل",
  transport: "النقل",
  detailing: "العناية",
  warranty: "الضمان",
  parts: "قطع الغيار",
};

export const serviceCategoryIcons: Readonly<
  Record<ServiceCategory, string>
> = {
  inspection: "✓",
  maintenance: "⚙",
  insurance: "◈",
  finance: "د.إ",
  transport: "↔",
  detailing: "✦",
  warranty: "◇",
  parts: "▦",
};

export function findServiceBySlug(
  slug: string,
): AutomotiveService | undefined {
  return automotiveServices.find(
    (service) => service.slug === slug,
  );
}
