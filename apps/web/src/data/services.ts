export type ServiceCategory =
  | "inspection"
  | "maintenance"
  | "insurance"
  | "finance"
  | "transport"
  | "detailing"
  | "warranty"
  | "parts";

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
  instantBooking: boolean;
  responseMinutes: number;
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
    instantBooking: true,
    responseMinutes: 4,
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
    instantBooking: true,
    responseMinutes: 8,
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
    instantBooking: true,
    responseMinutes: 12,
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
    instantBooking: false,
    responseMinutes: 15,
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
    instantBooking: false,
    responseMinutes: 20,
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
    instantBooking: true,
    responseMinutes: 3,
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

export function findServiceBySlug(
  slug: string,
): AutomotiveService | undefined {
  return automotiveServices.find(
    (service) => service.slug === slug,
  );
}
