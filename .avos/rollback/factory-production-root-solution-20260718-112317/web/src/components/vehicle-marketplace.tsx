"use client";

import { useMemo } from "react";
import { vehicles } from "@/data/vehicles";
import {
  filterVehicles,
} from "@/lib/vehicle-search";
import {
  useVehicleSearchStore,
} from "@/store/vehicle-search-store";
import { VehicleCard } from "./vehicle-card";
import { VehicleFilters } from "./vehicle-filters";
import { VehicleAiAssistant } from "./vehicle-ai-assistant";
import { ComparisonTray } from "./comparison-tray";

export function VehicleMarketplace() {
  const filters = useVehicleSearchStore(
    (state) => state.filters,
  );

  const setFilter = useVehicleSearchStore(
    (state) => state.setFilter,
  );

  const saveCurrentSearch = useVehicleSearchStore(
    (state) => state.saveCurrentSearch,
  );

  const filtered = useMemo(
    () => filterVehicles(vehicles, filters),
    [filters],
  );

  return (
    <>
      <VehicleAiAssistant />
      <section className="marketplace-shell">
      <VehicleFilters />

      <div className="marketplace-results">
        <div className="marketplace-toolbar">
          <div>
            <span>سوق AVOS</span>
            <h1>السيارات المتاحة</h1>
            <p>
              تم العثور على {filtered.length} سيارة مطابقة
            </p>
          </div>

          <div className="marketplace-toolbar-actions">
            <button
              type="button"
              onClick={saveCurrentSearch}
            >
              احفظ البحث ونبّهني
            </button>
          <label>
            <span>الترتيب</span>
            <select
              value={filters.sort}
              onChange={(event) =>
                setFilter(
                  "sort",
                  event.target.value as
                    typeof filters.sort,
                )
              }
            >
              <option value="newest">الأحدث</option>
              <option value="price-asc">
                السعر: الأقل أولًا
              </option>
              <option value="price-desc">
                السعر: الأعلى أولًا
              </option>
              <option value="mileage-asc">
                الأقل استخدامًا
              </option>
            </select>
          </label>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="vehicle-grid">
            {filtered.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>لا توجد سيارات مطابقة</strong>
            <p>
              عدّل خيارات البحث أو أعد ضبط الفلاتر.
            </p>
          </div>
        )}
      </div>
    </section>
      <ComparisonTray />
    </>
  );
}
