"use client";

import { useEffect, useState } from "react";
import { fetchWorkshopGrid } from "../api/w-or-ks-ho-pg-ri-d-api";
import type { WorkshopItem } from "../types";

export function useWorkshopGrid() {
  const [items, setItems] = useState<WorkshopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkshopGrid()
      .then(setItems)
      .catch(() => setError("ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª."))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}