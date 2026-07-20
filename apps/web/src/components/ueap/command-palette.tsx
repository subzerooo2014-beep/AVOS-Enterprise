"use client";

import { useMemo, useState } from "react";
import { runtimeApplications } from "@/lib/ueap/registry";

export function CommandPalette() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return runtimeApplications;
    return runtimeApplications.filter((application) =>
      `${application.name} ${application.category} ${application.route}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  return (
    <section className="ueap-command">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="ابحث أو نفّذ أمرًا داخل AVOS..."
        aria-label="Unified search and command palette"
      />
      <div>
        {results.map((application) => (
          <a key={application.id} href={application.route}>
            <strong>{application.name}</strong>
            <span>{application.category}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
