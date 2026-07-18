import type { AuctionItem } from "../types";

export async function fetchAuctionGrid(): Promise<AuctionItem[]> {
  return [
    {
      id: "1",
      title: "Ø§Ù„Ù…Ø²Ø§Ø¯Ø§Øª",
      description: "Ù…Ø²Ø§Ø¯Ø§Øª Ù…Ø­Ù„ÙŠØ© ÙˆØ¯ÙˆÙ„ÙŠØ© Ù…Ø¹ Ø¹Ø²Ù….",
    },
  ];
}