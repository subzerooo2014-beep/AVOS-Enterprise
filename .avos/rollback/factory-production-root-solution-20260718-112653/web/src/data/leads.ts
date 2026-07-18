export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "offer"
  | "negotiation"
  | "won";

export interface SellerLead {
  id: string;
  customerName: string;
  vehicleTitle: string;
  stage: LeadStage;
  score: number;
  phone: string;
  source: string;
  budget?: number;
  notes: readonly string[];
}

export const sellerLeads: readonly SellerLead[] = [
  {
    id: "lead-001",
    customerName: "محمد الكعبي",
    vehicleTitle: "Range Rover Sport HSE",
    stage: "negotiation",
    score: 94,
    phone: "+971 50 555 1101",
    source: "AVOS AI Search",
    budget: 350000,
    notes: ["مهتم بالتمويل", "طلب مقارنة مع LX 600"],
  },
  {
    id: "lead-002",
    customerName: "سارة المنصوري",
    vehicleTitle: "Tesla Model Y Long Range",
    stage: "qualified",
    score: 89,
    phone: "+971 55 420 8871",
    source: "Saved Search",
    budget: 185000,
    notes: ["تفضل موعدًا مسائيًا"],
  },
  {
    id: "lead-003",
    customerName: "خالد السويدي",
    vehicleTitle: "Toyota Land Cruiser VXR",
    stage: "offer",
    score: 96,
    phone: "+971 52 778 3402",
    source: "Marketplace",
    budget: 380000,
    notes: ["يريد موافقة تمويل أولية"],
  },
  {
    id: "lead-004",
    customerName: "علي الشامسي",
    vehicleTitle: "Lexus LX 600 VIP",
    stage: "contacted",
    score: 78,
    phone: "+971 56 990 4130",
    source: "Plate Cross-sell",
    notes: ["طلب تقرير فحص كامل"],
  },
  {
    id: "lead-005",
    customerName: "راشد المزروعي",
    vehicleTitle: "Mercedes-Benz G63 AMG",
    stage: "new",
    score: 72,
    phone: "+971 50 442 1290",
    source: "Direct",
    notes: [],
  },
];

export const leadStageLabels: Readonly<Record<LeadStage, string>> = {
  new: "جديد",
  contacted: "تم التواصل",
  qualified: "مؤهل",
  offer: "عرض",
  negotiation: "تفاوض",
  won: "مكتمل",
};
