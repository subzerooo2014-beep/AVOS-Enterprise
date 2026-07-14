"use client";

import { useEffect, useState } from "react";
import { fetchAuctionGrid } from "../api/a-uc-ti-on-gr-id-api";
import type { AuctionItem } from "../types";

export function useAuctionGrid() {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuctionGrid()
      .then(setItems)
      .catch(() => setError("ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª."))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}