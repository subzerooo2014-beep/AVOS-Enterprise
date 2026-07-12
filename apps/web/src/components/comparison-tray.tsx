"use client";

import Link from "next/link";
import { vehicles } from "@/data/vehicles";
import {
  useVehicleSearchStore,
} from "@/store/vehicle-search-store";

export function ComparisonTray() {
  const compared = useVehicleSearchStore(
    (state) => state.compared,
  );

  const clearComparison = useVehicleSearchStore(
    (state) => state.clearComparison,
  );

  const selected = vehicles.filter(
    (vehicle) =>
      compared.includes(vehicle.id),
  );

  if (selected.length === 0) {
    return null;
  }

  const query = selected
    .map((vehicle) => vehicle.id)
    .join(",");

  return (
    <div className="comparison-tray">
      <div>
        <strong>
          مقارنة {selected.length} سيارة
        </strong>
        <span>
          يمكنك اختيار حتى 3 سيارات
        </span>
      </div>

      <div className="comparison-miniatures">
        {selected.map((vehicle) => (
          <img
            key={vehicle.id}
            src={vehicle.image}
            alt={vehicle.title}
          />
        ))}
      </div>

      <Link href={`/vehicles/compare?ids=${query}`}>
        ابدأ المقارنة الذكية
      </Link>

      <button
        type="button"
        onClick={clearComparison}
      >
        مسح
      </button>
    </div>
  );
}
