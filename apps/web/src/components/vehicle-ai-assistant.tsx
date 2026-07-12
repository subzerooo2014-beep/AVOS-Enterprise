"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { vehicles } from "@/data/vehicles";
import {
  recommendVehicles,
} from "@/lib/vehicle-intelligence";
import {
  formatPrice,
} from "@/lib/vehicle-search";

const prompts = [
  "أفضل SUV عائلية أقل من 400 ألف",
  "سيارة فاخرة تحافظ على سعرها",
  "سيارة كهربائية اقتصادية",
  "أفضل فرصة موثقة في دبي",
];

export function VehicleAiAssistant() {
  const [query, setQuery] = useState(prompts[0]);

  const recommendations = useMemo(() => {
    const normalized = query.toLowerCase();

    return recommendVehicles(vehicles, {
      budget:
        normalized.includes("400")
          ? 400000
          : normalized.includes("اقتصادية")
            ? 220000
            : undefined,
      preferredBody:
        normalized.includes("suv") ||
        normalized.includes("عائلية")
          ? "suv"
          : undefined,
      preferredCity:
        normalized.includes("دبي")
          ? "دبي"
          : undefined,
      requireVerified:
        normalized.includes("موثقة"),
    });
  }, [query]);

  return (
    <section className="vehicle-ai-assistant">
      <div className="assistant-heading">
        <div>
          <span>AVOS Vehicle Intelligence</span>
          <h2>ماذا تريد في سيارتك القادمة؟</h2>
          <p>
            اكتب احتياجك بلغة طبيعية، وسيحلل AVOS
            السوق ويقترح أفضل الخيارات.
          </p>
        </div>
        <div className="assistant-status">
          <i />
          المحرك الذكي جاهز
        </div>
      </div>

      <div className="assistant-input-row">
        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="مثال: أريد SUV عائلية موثقة تحت 350 ألف..."
        />
        <button type="button">حلّل السوق</button>
      </div>

      <div className="assistant-prompts">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setQuery(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="assistant-recommendations">
        {recommendations.map((item) => (
          <Link
            key={item.vehicle.id}
            href={`/vehicles/${item.vehicle.slug}`}
          >
            <img
              src={item.vehicle.image}
              alt={item.vehicle.title}
            />
            <div>
              <span>تطابق {item.score}%</span>
              <strong>{item.vehicle.title}</strong>
              <small>
                {item.reasons.join(" · ")}
              </small>
            </div>
            <b>
              {formatPrice(item.vehicle.price)} د.إ
            </b>
          </Link>
        ))}
      </div>
    </section>
  );
}
