"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  globalSearch,
  GlobalSearchType,
} from "@/lib/global-search";

const labels: Readonly<
  Record<GlobalSearchType, string>
> = {
  vehicle: "سيارة",
  plate: "رقم",
  service: "خدمة",
  auction: "مزاد",
  part: "قطعة",
  rental: "تأجير",
};

export function GlobalSearchBox() {
  const [query, setQuery] =
    useState("");

  const results = useMemo(
    () => globalSearch(query),
    [query],
  );

  return (
    <section className="global-search-box">
      <div>
        <span>AVOS Universal Search</span>
        <h1>
          ابحث في جميع أسواق AVOS.
        </h1>
        <p>
          سيارات، مزادات، أرقام، خدمات،
          قطع غيار وتأجير في بحث واحد.
        </p>
      </div>

      <input
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
        placeholder="مثال: Range Rover، فحص، لوحة دبي 7..."
      />

      {query ? (
        <div className="global-search-results">
          {results.length > 0 ? (
            results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.href}
              >
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.title}
                  />
                ) : (
                  <div className="search-result-placeholder">
                    AVOS
                  </div>
                )}

                <div>
                  <span>
                    {labels[result.type]} ·
                    تطابق {result.score}%
                  </span>
                  <strong>
                    {result.title}
                  </strong>
                  <small>
                    {result.subtitle}
                  </small>
                </div>
              </Link>
            ))
          ) : (
            <div className="search-empty">
              لا توجد نتائج مطابقة.
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
