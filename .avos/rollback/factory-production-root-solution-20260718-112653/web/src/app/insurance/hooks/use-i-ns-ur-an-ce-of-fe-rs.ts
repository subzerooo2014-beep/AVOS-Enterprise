"use client";

import { useEffect, useState } from "react";
import { fetchInsuranceOffers } from "../api/i-ns-ur-an-ce-of-fe-rs-api";
import type { InsuranceOffer } from "../types";

export function useInsuranceOffers() {
  const [items, setItems] = useState<InsuranceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsuranceOffers()
      .then(setItems)
      .catch(() => setError("ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª."))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}