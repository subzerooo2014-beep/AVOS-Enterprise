"use client";

import { useMemo } from "react";
import {
  automotiveServices,
  serviceCategoryLabels,
} from "@/data/services";
import {
  useServiceMarketplaceStore,
} from "@/store/service-marketplace-store";
import { ServiceCard } from "./service-card";

export function ServiceMarketplace() {
  const category =
    useServiceMarketplaceStore(
      (state) => state.category,
    );

  const city =
    useServiceMarketplaceStore(
      (state) => state.city,
    );

  const mobileOnly =
    useServiceMarketplaceStore(
      (state) => state.mobileOnly,
    );

  const instantOnly =
    useServiceMarketplaceStore(
      (state) => state.instantOnly,
    );

  const setCategory =
    useServiceMarketplaceStore(
      (state) => state.setCategory,
    );

  const setCity =
    useServiceMarketplaceStore(
      (state) => state.setCity,
    );

  const setMobileOnly =
    useServiceMarketplaceStore(
      (state) => state.setMobileOnly,
    );

  const setInstantOnly =
    useServiceMarketplaceStore(
      (state) => state.setInstantOnly,
    );

  const reset =
    useServiceMarketplaceStore(
      (state) => state.reset,
    );

  const filtered = useMemo(
    () =>
      automotiveServices.filter(
        (service) =>
          (!category ||
            service.category === category) &&
          (!city ||
            service.city === city ||
            service.city === "الإمارات") &&
          (!mobileOnly ||
            service.mobileService) &&
          (!instantOnly ||
            service.instantBooking),
      ),
    [
      category,
      city,
      mobileOnly,
      instantOnly,
    ],
  );

  return (
    <div className="services-market-layout">
      <aside className="services-filters">
        <div>
          <span>بحث متقدم</span>
          <h2>فلترة الخدمات</h2>
          <button
            type="button"
            onClick={reset}
          >
            إعادة ضبط
          </button>
        </div>

        <label>
          <span>الفئة</span>
          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as
                  | keyof typeof serviceCategoryLabels
                  | "",
              )
            }
          >
            <option value="">
              جميع الخدمات
            </option>
            {Object.entries(
              serviceCategoryLabels,
            ).map(([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>المدينة</span>
          <select
            value={city}
            onChange={(event) =>
              setCity(event.target.value)
            }
          >
            <option value="">
              جميع المدن
            </option>
            <option value="دبي">
              دبي
            </option>
            <option value="أبوظبي">
              أبوظبي
            </option>
            <option value="الشارقة">
              الشارقة
            </option>
          </select>
        </label>

        <label className="service-check">
          <input
            type="checkbox"
            checked={mobileOnly}
            onChange={(event) =>
              setMobileOnly(
                event.target.checked,
              )
            }
          />
          خدمة متنقلة فقط
        </label>

        <label className="service-check">
          <input
            type="checkbox"
            checked={instantOnly}
            onChange={(event) =>
              setInstantOnly(
                event.target.checked,
              )
            }
          />
          حجز فوري فقط
        </label>
      </aside>

      <section>
        <div className="services-results-heading">
          <div>
            <span>AVOS Services</span>
            <h1>الخدمات المتاحة</h1>
            <p>
              {filtered.length} خدمة مطابقة
            </p>
          </div>
        </div>

        <div className="services-market-grid">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
