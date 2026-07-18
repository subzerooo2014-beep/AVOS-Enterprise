export type BookingType =
  | "test-drive"
  | "inspection"
  | "service"
  | "video-call";

export interface BuyerBooking {
  id: string;
  type: BookingType;
  vehicleTitle: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  reference: string;
}

export const buyerBookings: readonly BuyerBooking[] = [
  {
    id: "booking-001",
    type: "test-drive",
    vehicleTitle: "Tesla Model Y Long Range",
    provider: "Future Mobility",
    date: "2026-07-16",
    time: "18:30",
    location: "دبي — شارع الشيخ زايد",
    status: "confirmed",
    reference: "AVOS-TD-28410",
  },
  {
    id: "booking-002",
    type: "inspection",
    vehicleTitle: "Range Rover Sport HSE",
    provider: "AVOS Inspection Center",
    date: "2026-07-15",
    time: "17:00",
    location: "دبي — القوز",
    status: "pending",
    reference: "AVOS-IN-44208",
  },
  {
    id: "booking-003",
    type: "video-call",
    vehicleTitle: "Toyota Land Cruiser VXR",
    provider: "Emirates Auto Hub",
    date: "2026-07-14",
    time: "20:00",
    location: "مكالمة فيديو داخل AVOS",
    status: "confirmed",
    reference: "AVOS-VC-19002",
  },
];

export const bookingTypeLabels: Readonly<Record<BookingType, string>> = {
  "test-drive": "تجربة قيادة",
  inspection: "فحص سيارة",
  service: "خدمة",
  "video-call": "مكالمة فيديو",
};
