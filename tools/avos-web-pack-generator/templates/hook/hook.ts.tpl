"use client";

import { useEffect, useState } from "react";
import { fetch{{ApiName}} } from "../api/{{apiFile}}-api";
import type { {{TypeName}} } from "../types";

export function use{{HookName}}() {
  const [items, setItems] = useState<{{TypeName}}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch{{ApiName}}()
      .then(setItems)
      .catch(() => setError("تعذر تحميل البيانات."))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}