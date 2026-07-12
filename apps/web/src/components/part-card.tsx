import Link from "next/link";
import {
  AutoPart,
} from "@/data/parts";
import {
  formatPrice,
} from "@/lib/vehicle-search";

export function PartCard({
  part,
}: {
  part: AutoPart;
}) {
  return (
    <article className="part-card">
      <img
        src={part.image}
        alt={part.title}
      />

      <div>
        <span>
          {part.condition === "new"
            ? "جديد"
            : part.condition === "used"
              ? "مستعمل"
              : "مجدّد"}
        </span>
        <h2>{part.title}</h2>
        <p>
          متوافق مع:{" "}
          {part.compatibleVehicles.join(", ")}
        </p>

        <div className="part-meta">
          <strong>
            {formatPrice(part.price)} د.إ
          </strong>
          <small>
            متوفر {part.stock} قطع
          </small>
        </div>

        <Link
          href={`/parts/${part.slug}`}
        >
          عرض القطعة
        </Link>
      </div>
    </article>
  );
}
