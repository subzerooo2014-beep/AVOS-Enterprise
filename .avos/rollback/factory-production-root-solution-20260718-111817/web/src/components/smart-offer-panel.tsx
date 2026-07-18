"use client";

import { useMemo, useState } from "react";
import {
  calculateSmartOffer,
} from "@/lib/commerce-intelligence";
import {
  formatPrice,
} from "@/lib/vehicle-search";

export function SmartOfferPanel({
  askingPrice,
}: {
  askingPrice: number;
}) {
  const [daysListed, setDaysListed] = useState(18);

  const offer = useMemo(
    () =>
      calculateSmartOffer({
        askingPrice,
        daysListed,
        marketScore: 86,
      }),
    [askingPrice, daysListed],
  );

  return (
    <section className="smart-offer-panel">
      <div>
        <span>AVOS Negotiation Intelligence</span>
        <h2>قدّم عرضًا ذكيًا</h2>
        <p>{offer.message}</p>
      </div>

      <div className="offer-recommendation">
        <span>العرض المقترح</span>
        <strong>
          {formatPrice(offer.recommendedOffer)} د.إ
        </strong>
        <small>
          ثقة التحليل {offer.confidence}%
        </small>
      </div>

      <label>
        <span>مدة الإعلان</span>
        <input
          type="range"
          min="1"
          max="90"
          value={daysListed}
          onChange={(event) =>
            setDaysListed(Number(event.target.value))
          }
        />
        <b>{daysListed} يومًا</b>
      </label>

      <button className="button button-primary">
        إرسال العرض للبائع
      </button>
    </section>
  );
}
