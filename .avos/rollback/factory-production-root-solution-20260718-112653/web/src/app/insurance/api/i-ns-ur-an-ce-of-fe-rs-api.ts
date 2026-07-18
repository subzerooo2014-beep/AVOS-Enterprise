import type { InsuranceOffer } from "../types";

export async function fetchInsuranceOffers(): Promise<InsuranceOffer[]> {
  return [
    {
      id: "1",
      title: "Ø§Ù„ØªØ£Ù…ÙŠÙ†",
      description: "Ù‚Ø§Ø±Ù† Ø¹Ø±ÙˆØ¶ Ø§Ù„ØªØ£Ù…ÙŠÙ† Ø¨Ø³Ø±Ø¹Ø©.",
    },
  ];
}