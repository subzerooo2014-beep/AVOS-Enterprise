import Link from "next/link";
import {
  RentalVehicle,
} from "@/data/rentals";
import {
  formatPrice,
} from "@/lib/vehicle-search";

export function RentalCard({
  rental,
}: {
  rental: RentalVehicle;
}) {
  return (
    <article className="rental-card">
      <div className="rental-image">
        <img
          src={rental.image}
          alt={rental.title}
        />
        <span>
          {rental.availableNow
            ? "متاح الآن"
            : "محجوز"}
        </span>
      </div>

      <div className="rental-body">
        <span>{rental.category}</span>
        <h2>{rental.title}</h2>
        <p>
          {rental.city} · {rental.provider}
        </p>

        <div className="rental-price-grid">
          <div>
            <span>يومي</span>
            <strong>
              {formatPrice(
                rental.dailyPrice,
              )}{" "}
              د.إ
            </strong>
          </div>
          <div>
            <span>شهري</span>
            <strong>
              {formatPrice(
                rental.monthlyPrice,
              )}{" "}
              د.إ
            </strong>
          </div>
        </div>

        <Link
          href={`/rentals/${rental.slug}`}
        >
          عرض وحجز
        </Link>
      </div>
    </article>
  );
}
