export interface ServiceProvider {
  id: string;
  slug: string;
  name: string;
  type:
    | "dealer"
    | "workshop"
    | "inspection"
    | "insurance"
    | "logistics";
  city: string;
  verified: boolean;
  rating: number;
  reviews: number;
  activeListings: number;
  completedJobs: number;
  responseMinutes: number;
  logo: string;
  cover: string;
  description: string;
  certifications: readonly string[];
}

export const serviceProviders: readonly ServiceProvider[] = [
  {
    id: "provider-001",
    slug: "avos-inspection-center",
    name: "AVOS Inspection Center",
    type: "inspection",
    city: "دبي",
    verified: true,
    rating: 4.9,
    reviews: 842,
    activeListings: 4,
    completedJobs: 12840,
    responseMinutes: 4,
    logo: "AI",
    cover:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80",
    description:
      "مركز فحص ذكي معتمد يقدم تقارير رقمية متكاملة قبل الشراء والبيع.",
    certifications: [
      "AVOS Verified",
      "ISO 9001",
      "EV Inspection Ready",
    ],
  },
  {
    id: "provider-002",
    slug: "elite-auto-spa",
    name: "Elite Auto Spa",
    type: "workshop",
    city: "أبوظبي",
    verified: true,
    rating: 4.8,
    reviews: 316,
    activeListings: 6,
    completedJobs: 4260,
    responseMinutes: 8,
    logo: "EA",
    cover:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1600&q=80",
    description:
      "مركز عناية وتفصيل فاخر متخصص في الحماية والتلميع الداخلي والخارجي.",
    certifications: [
      "Ceramic Pro",
      "AVOS Verified",
    ],
  },
  {
    id: "provider-003",
    slug: "capital-elite-cars",
    name: "Capital Elite Cars",
    type: "dealer",
    city: "أبوظبي",
    verified: true,
    rating: 4.8,
    reviews: 544,
    activeListings: 128,
    completedJobs: 3840,
    responseMinutes: 6,
    logo: "CE",
    cover:
      "https://images.unsplash.com/photo-1562141961-b5d9eeb5cf90?auto=format&fit=crop&w=1600&q=80",
    description:
      "معرض سيارات فاخرة معتمد متخصص في السيارات الأوروبية والخليجية.",
    certifications: [
      "AVOS Premium Dealer",
      "Trade License Verified",
    ],
  },
  {
    id: "provider-004",
    slug: "emirates-vehicle-logistics",
    name: "Emirates Vehicle Logistics",
    type: "logistics",
    city: "الشارقة",
    verified: true,
    rating: 4.8,
    reviews: 204,
    activeListings: 3,
    completedJobs: 9850,
    responseMinutes: 15,
    logo: "EV",
    cover:
      "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=1600&q=80",
    description:
      "حلول نقل سيارات مؤمنة داخل الإمارات مع تتبع مباشر وتوثيق الاستلام.",
    certifications: [
      "Insured Carrier",
      "AVOS Verified",
    ],
  },
];

export function findProviderBySlug(
  slug: string,
): ServiceProvider | undefined {
  return serviceProviders.find(
    (provider) => provider.slug === slug,
  );
}
