import type { WorkshopItem } from "../types";

export async function fetchWorkshopGrid(): Promise<WorkshopItem[]> {
  return [
    {
      id: "1",
      title: "Ø§Ù„ÙˆØ±Ø´ ÙˆØ§Ù„ØµÙŠØ§Ù†Ø©",
      description: "ÙˆØ±Ø´ Ù…ÙˆØ«ÙˆÙ‚Ø© ÙˆØ®Ø¯Ù…Ø§Øª Ù‚Ø±ÙŠØ¨Ø©.",
    },
  ];
}