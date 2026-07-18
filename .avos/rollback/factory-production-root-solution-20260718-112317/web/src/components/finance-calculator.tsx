"use client";

import { useMemo, useState } from "react";
import {
  calculateFinanceQuote,
} from "@/lib/commerce-intelligence";
import {
  formatPrice,
} from "@/lib/vehicle-search";

export function FinanceCalculator({
  vehiclePrice,
}: {
  vehiclePrice: number;
}) {
  const [downPayment, setDownPayment] = useState(20);
  const [months, setMonths] = useState(60);

  const quote = useMemo(
    () =>
      calculateFinanceQuote({
        vehiclePrice,
        downPaymentPercent: downPayment,
        durationMonths: months,
        annualRate: 4.25,
      }),
    [vehiclePrice, downPayment, months],
  );

  return (
    <section className="finance-calculator">
      <div>
        <span>AVOS Finance</span>
        <h2>احسب التمويل المناسب</h2>
      </div>

      <div className="finance-controls">
        <label>
          <span>الدفعة الأولى</span>
          <select
            value={downPayment}
            onChange={(event) =>
              setDownPayment(Number(event.target.value))
            }
          >
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </label>

        <label>
          <span>المدة</span>
          <select
            value={months}
            onChange={(event) =>
              setMonths(Number(event.target.value))
            }
          >
            <option value={36}>3 سنوات</option>
            <option value={48}>4 سنوات</option>
            <option value={60}>5 سنوات</option>
          </select>
        </label>
      </div>

      <div className="finance-results">
        <article>
          <span>القسط الشهري</span>
          <strong>
            {formatPrice(quote.monthlyPayment)} د.إ
          </strong>
        </article>
        <article>
          <span>الدفعة الأولى</span>
          <strong>
            {formatPrice(quote.downPayment)} د.إ
          </strong>
        </article>
        <article>
          <span>المبلغ الممول</span>
          <strong>
            {formatPrice(quote.financedAmount)} د.إ
          </strong>
        </article>
      </div>

      <button className="button button-primary">
        اطلب موافقة مبدئية
      </button>
    </section>
  );
}
