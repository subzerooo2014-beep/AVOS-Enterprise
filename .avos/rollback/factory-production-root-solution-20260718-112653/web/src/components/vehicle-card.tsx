"use client";

import Link from "next/link";
import { Vehicle } from "@/data/vehicles";
import {
  formatMileage,
  formatPrice,
} from "@/lib/vehicle-search";
import {
  useVehicleSearchStore,
} from "@/store/vehicle-search-store";

export function VehicleCard({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  const favorites = useVehicleSearchStore(
    (state) => state.favorites,
  );

  const toggleFavorite = useVehicleSearchStore(
    (state) => state.toggleFavorite,
  );

  const compared = useVehicleSearchStore(
    (state) => state.compared,
  );

  const toggleCompare = useVehicleSearchStore(
    (state) => state.toggleCompare,
  );

  const favorite = favorites.includes(vehicle.id);
  const inComparison = compared.includes(vehicle.id);

  return (
    <article className="vehicle-card">
      <div className="vehicle-image-wrap">
        <img
          src={vehicle.image}
          alt={vehicle.title}
          className="vehicle-image"
        />

        {vehicle.featured ? (
          <span className="vehicle-badge featured">
            مميز
          </span>
        ) : null}

        {vehicle.verified ? (
          <span className="vehicle-badge verified">
            موثق
          </span>
        ) : null}

        <button
          className={
            favorite
              ? "favorite-button is-active"
              : "favorite-button"
          }
          type="button"
          aria-label="إضافة للمفضلة"
          onClick={() =>
            toggleFavorite(vehicle.id)
          }
        >
          {favorite ? "♥" : "♡"}
        </button>

        <button
          className={
            inComparison
              ? "compare-button is-active"
              : "compare-button"
          }
          type="button"
          onClick={() =>
            toggleCompare(vehicle.id)
          }
        >
          {inComparison ? "تمت المقارنة" : "قارن"}
        </button>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-title-row">
          <div>
            <h3>{vehicle.title}</h3>
            <span>
              {vehicle.year} · {vehicle.city}
            </span>
          </div>
          <strong>
            {formatPrice(vehicle.price)} د.إ
          </strong>
        </div>

        <div className="vehicle-spec-row">
          <span>{formatMileage(vehicle.mileage)} كم</span>
          <span>
            {vehicle.transmission === "automatic"
              ? "أوتوماتيك"
              : "عادي"}
          </span>
          <span>
            {vehicle.fuel === "electric"
              ? "كهربائي"
              : vehicle.fuel === "hybrid"
                ? "هجين"
                : "بنزين"}
          </span>
        </div>

        <div className="vehicle-card-footer">
          <div>
            <span>المعلن</span>
            <strong>{vehicle.dealer}</strong>
          </div>

          <Link
            href={`/vehicles/${vehicle.slug}`}
            className="vehicle-link"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}
