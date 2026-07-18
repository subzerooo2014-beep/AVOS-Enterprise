export type BuyerActivityType =
  | "favorite"
  | "comparison"
  | "message"
  | "booking"
  | "offer"
  | "alert";

export interface BuyerActivity {
  id: string;
  type: BuyerActivityType;
  title: string;
  description: string;
  href: string;
  occurredAt: string;
  unread: boolean;
}

export const buyerActivities: readonly BuyerActivity[] = [
  {
    id: "activity-001",
    type: "alert",
    title: "انخفض سعر Range Rover Sport",
    description: "انخفض السعر بمقدار 8,000 د.إ منذ آخر زيارة.",
    href: "/vehicles/range-rover-sport-2025-hse",
    occurredAt: "2026-07-12T19:20:00.000Z",
    unread: true,
  },
  {
    id: "activity-002",
    type: "message",
    title: "رسالة جديدة من AVOS Premium Motors",
    description: "البائع وافق على ترتيب موعد فحص غدًا.",
    href: "/account/messages",
    occurredAt: "2026-07-12T18:45:00.000Z",
    unread: true,
  },
  {
    id: "activity-003",
    type: "booking",
    title: "تم تأكيد تجربة القيادة",
    description: "Tesla Model Y — دبي، الساعة 6:30 مساءً.",
    href: "/account/bookings",
    occurredAt: "2026-07-12T17:00:00.000Z",
    unread: false,
  },
  {
    id: "activity-004",
    type: "comparison",
    title: "مقارنة محفوظة",
    description: "Land Cruiser مقابل Lexus LX 600.",
    href: "/vehicles/compare?ids=veh-003,veh-008",
    occurredAt: "2026-07-12T15:30:00.000Z",
    unread: false,
  },
  {
    id: "activity-005",
    type: "offer",
    title: "تم إرسال عرضك",
    description: "عرض بقيمة 350,000 د.إ على Range Rover Sport.",
    href: "/account/offers",
    occurredAt: "2026-07-12T14:10:00.000Z",
    unread: false,
  },
];
