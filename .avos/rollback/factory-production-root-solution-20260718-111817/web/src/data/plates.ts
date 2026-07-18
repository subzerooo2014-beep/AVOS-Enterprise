export interface PlateListing {
  id: string;
  emirate: string;
  code: string;
  number: string;
  price: number;
  rarity: "ultra" | "premium" | "special";
  verified: boolean;
  seller: string;
}

export const plateListings: readonly PlateListing[] = [
  {
    id: "plate-001",
    emirate: "دبي",
    code: "AA",
    number: "7",
    price: 22500000,
    rarity: "ultra",
    verified: true,
    seller: "AVOS Signature Numbers",
  },
  {
    id: "plate-002",
    emirate: "أبوظبي",
    code: "1",
    number: "88",
    price: 4850000,
    rarity: "ultra",
    verified: true,
    seller: "Capital Numbers",
  },
  {
    id: "plate-003",
    emirate: "دبي",
    code: "Z",
    number: "2026",
    price: 780000,
    rarity: "premium",
    verified: true,
    seller: "AVOS Signature Numbers",
  },
  {
    id: "plate-004",
    emirate: "الشارقة",
    code: "3",
    number: "555",
    price: 395000,
    rarity: "premium",
    verified: true,
    seller: "Elite Plates",
  },
  {
    id: "plate-005",
    emirate: "عجمان",
    code: "B",
    number: "9090",
    price: 125000,
    rarity: "special",
    verified: true,
    seller: "Numbers Hub",
  },
  {
    id: "plate-006",
    emirate: "رأس الخيمة",
    code: "I",
    number: "1111",
    price: 180000,
    rarity: "special",
    verified: true,
    seller: "Northern Plates",
  },
];
