export interface ConversationMessage {
  id: string;
  sender: "buyer" | "seller" | "avos";
  text: string;
  sentAt: string;
  read: boolean;
}

export interface BuyerConversation {
  id: string;
  sellerName: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  online: boolean;
  unreadCount: number;
  messages: readonly ConversationMessage[];
}

export const buyerConversations: readonly BuyerConversation[] = [
  {
    id: "conversation-001",
    sellerName: "AVOS Premium Motors",
    vehicleId: "veh-001",
    vehicleTitle: "Range Rover Sport HSE",
    vehicleImage:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80",
    online: true,
    unreadCount: 2,
    messages: [
      {
        id: "message-001",
        sender: "buyer",
        text: "هل السيارة ما زالت متاحة؟",
        sentAt: "2026-07-12T17:55:00.000Z",
        read: true,
      },
      {
        id: "message-002",
        sender: "seller",
        text: "نعم، وهي متاحة للفحص وتجربة القيادة.",
        sentAt: "2026-07-12T18:02:00.000Z",
        read: true,
      },
      {
        id: "message-003",
        sender: "avos",
        text: "اقتراح: اطلب تقرير الفحص قبل تثبيت العرض.",
        sentAt: "2026-07-12T18:03:00.000Z",
        read: true,
      },
      {
        id: "message-004",
        sender: "seller",
        text: "يمكننا ترتيب موعد غدًا الساعة 5 مساءً.",
        sentAt: "2026-07-12T18:45:00.000Z",
        read: false,
      },
    ],
  },
  {
    id: "conversation-002",
    sellerName: "Future Mobility",
    vehicleId: "veh-005",
    vehicleTitle: "Tesla Model Y Long Range",
    vehicleImage:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80",
    online: false,
    unreadCount: 0,
    messages: [
      {
        id: "message-005",
        sender: "buyer",
        text: "أريد تجربة قيادة مساء الخميس.",
        sentAt: "2026-07-12T12:10:00.000Z",
        read: true,
      },
      {
        id: "message-006",
        sender: "seller",
        text: "تم حجز الموعد، وستصلك التفاصيل.",
        sentAt: "2026-07-12T12:40:00.000Z",
        read: true,
      },
    ],
  },
];
