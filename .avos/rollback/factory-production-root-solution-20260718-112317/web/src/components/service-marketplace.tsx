"use client";

import { useMemo } from "react";
import {
  automotiveServices,
  serviceCategoryIcons,
  serviceCategoryLabels,
  ServiceCategory,
  ServiceSort,
} from "@/data/services";
import {
  useServiceMarketplaceStore,
} from "@/store/service-marketplace-store";
import { ServiceCard } from "./service-card";

const categoryEntries = Object.entries(
  serviceCategoryLabels,
) as [ServiceCategory, string][];

export function ServiceMarketplace() {
  const state = useServiceMarketplaceStore();

  const filtered = useMemo(() => {
    const normalizedQuery = state.query
      .trim()
      .toLocaleLowerCase("ar");

    const result = automotiveServices.filter(
      (service) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            service.title,
            service.providerName,
            service.description,
            service.city,
            ...service.highlights,
          ]
            .join(" ")
            .toLocaleLowerCase("ar")
            .includes(normalizedQuery);

        return (
          matchesQuery &&
          (!state.category ||
            service.category === state.category) &&
          (!state.city ||
            service.city === state.city ||
            service.city === "الإمارات") &&
          (!state.mobileOnly || service.mobileService) &&
          (!state.homeOnly || service.homeService) &&
          (!state.instantOnly || service.instantBooking) &&
          (!state.openOnly || service.openNow) &&
          service.rating >= state.minimumRating
        );
      },
    );

    return [...result].sort((a, b) => {
      switch (state.sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.priceFrom - b.priceFrom;
        case "response":
          return a.responseMinutes - b.responseMinutes;
        default:
          return b.aiMatchScore - a.aiMatchScore;
      }
    });
  }, [state]);

  const promoted = useMemo(
    () =>
      automotiveServices
        .filter((service) => service.promoted)
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
        .slice(0, 3),
    [],
  );

  const averageRating = (
    automotiveServices.reduce(
      (total, service) => total + service.rating,
      0,
    ) / automotiveServices.length
  ).toFixed(1);

  return (
    <>
      <section className="services-command-panel">
        <div className="services-command-copy">
          <span>AVOS Service Intelligence</span>
          <h2>صف خدمتك بجملة واحدة.</h2>
          <p>
            ابحث باسم المشكلة أو نوع الخدمة، وسيقوم AVOS
            بترتيب الخيارات حسب التقييم والسعر وسرعة الوصول.
          </p>
        </div>

        <div className="services-smart-search">
          <input
            value={state.query}
            onChange={(event) =>
              state.setQuery(event.target.value)
            }
            placeholder="مثال: صوت في الفرامل، فحص قبل الشراء، بطارية متنقلة..."
            aria-label="بحث الخدمات"
          />
          <button type="button">بحث ذكي</button>
        </div>

        <div className="services-kpi-grid">
          <article>
            <span>مزودون موثقون</span>
            <strong>120+</strong>
            <small>في جميع الإمارات</small>
          </article>
          <article>
            <span>متوسط التقييم</span>
            <strong>{averageRating}/5</strong>
            <small>من آلاف المراجعات</small>
          </article>
          <article>
            <span>حجز فوري</span>
            <strong>
              {
                automotiveServices.filter(
                  (service) => service.instantBooking,
                ).length
              }
            </strong>
            <small>خدمات متاحة الآن</small>
          </article>
          <article>
            <span>استجابة ذكية</span>
            <strong>4 دقائق</strong>
            <small>لأفضل مزود مطابق</small>
          </article>
        </div>
      </section>

      <section className="service-category-strip">
        {categoryEntries.map(([value, label]) => {
          const count = automotiveServices.filter(
            (service) => service.category === value,
          ).length;

          return (
            <button
              key={value}
              type="button"
              className={
                state.category === value ? "is-active" : ""
              }
              onClick={() =>
                state.setCategory(
                  state.category === value ? "" : value,
                )
              }
            >
              <i>{serviceCategoryIcons[value]}</i>
              <span>{label}</span>
              <small>{count} خيارات</small>
            </button>
          );
        })}
      </section>

      <section className="services-ai-picks">
        <div>
          <span>مختارات AVOS</span>
          <h2>أفضل فرص الخدمة الآن</h2>
          <p>
            ترتيب تلقائي وفق الجودة وسرعة الاستجابة والعرض
            الحالي.
          </p>
        </div>

        <div className="services-ai-pick-grid">
          {promoted.map((service) => (
            <a
              key={service.id}
              href={`/services/${service.slug}`}
            >
              <img src={service.image} alt={service.title} />
              <div>
                <span>{service.aiMatchScore}% تطابق</span>
                <strong>{service.title}</strong>
                <small>
                  {service.providerName} · {service.city}
                </small>
              </div>
              <b>خصم {service.discountPercent}%</b>
            </a>
          ))}
        </div>
      </section>

      <div className="services-market-layout">
        <aside className="services-filters">
          <div>
            <span>بحث متقدم</span>
            <h2>فلترة الخدمات</h2>
            <button type="button" onClick={state.reset}>
              إعادة ضبط
            </button>
          </div>

          <label>
            <span>الفئة</span>
            <select
              value={state.category}
              onChange={(event) =>
                state.setCategory(
                  event.target.value as ServiceCategory | "",
                )
              }
            >
              <option value="">جميع الخدمات</option>
              {categoryEntries.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>المدينة</span>
            <select
              value={state.city}
              onChange={(event) =>
                state.setCity(event.target.value)
              }
            >
              <option value="">جميع المدن</option>
              <option value="دبي">دبي</option>
              <option value="أبوظبي">أبوظبي</option>
              <option value="الشارقة">الشارقة</option>
            </select>
          </label>

          <label>
            <span>الحد الأدنى للتقييم</span>
            <select
              value={state.minimumRating}
              onChange={(event) =>
                state.setMinimumRating(
                  Number(event.target.value),
                )
              }
            >
              <option value={0}>جميع التقييمات</option>
              <option value={4.5}>4.5 فأعلى</option>
              <option value={4.7}>4.7 فأعلى</option>
              <option value={4.8}>4.8 فأعلى</option>
            </select>
          </label>

          <label className="service-check">
            <input
              type="checkbox"
              checked={state.openOnly}
              onChange={(event) =>
                state.setOpenOnly(event.target.checked)
              }
            />
            مفتوح الآن
          </label>

          <label className="service-check">
            <input
              type="checkbox"
              checked={state.mobileOnly}
              onChange={(event) =>
                state.setMobileOnly(event.target.checked)
              }
            />
            خدمة متنقلة
          </label>

          <label className="service-check">
            <input
              type="checkbox"
              checked={state.homeOnly}
              onChange={(event) =>
                state.setHomeOnly(event.target.checked)
              }
            />
            خدمة منزلية
          </label>

          <label className="service-check">
            <input
              type="checkbox"
              checked={state.instantOnly}
              onChange={(event) =>
                state.setInstantOnly(event.target.checked)
              }
            />
            حجز فوري
          </label>
        </aside>

        <section>
          <div className="services-results-heading">
            <div>
              <span>AVOS Services</span>
              <h1>الخدمات المتاحة</h1>
              <p>{filtered.length} خدمة مطابقة</p>
            </div>

            <label>
              <span>الترتيب</span>
              <select
                value={state.sortBy}
                onChange={(event) =>
                  state.setSortBy(
                    event.target.value as ServiceSort,
                  )
                }
              >
                <option value="recommended">
                  الأنسب لك
                </option>
                <option value="rating">
                  الأعلى تقييمًا
                </option>
                <option value="price-low">
                  الأقل سعرًا
                </option>
                <option value="response">
                  الأسرع استجابة
                </option>
              </select>
            </label>
          </div>

          {filtered.length > 0 ? (
            <div className="services-market-grid">
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="services-empty-state">
              <strong>لا توجد نتائج مطابقة.</strong>
              <p>
                جرّب إزالة بعض الفلاتر أو البحث بوصف مختلف.
              </p>
              <button type="button" onClick={state.reset}>
                عرض جميع الخدمات
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
