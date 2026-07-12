import Link from "next/link";
import {
  AutomotiveService,
  serviceCategoryLabels,
} from "@/data/services";
import { formatPrice } from "@/lib/vehicle-search";

export function ServiceCard({
  service,
}: {
  service: AutomotiveService;
}) {
  const discountedPrice = Math.round(
    service.priceFrom *
      (1 - service.discountPercent / 100),
  );

  return (
    <article className="service-market-card">
      <div className="service-market-image">
        <img
          src={service.image}
          alt={service.title}
        />

        {service.verified ? (
          <span>مزود موثق</span>
        ) : null}

        {service.mobileService ? (
          <b>خدمة متنقلة</b>
        ) : null}

        {service.discountPercent > 0 ? (
          <em>
            خصم {service.discountPercent}%
          </em>
        ) : null}
      </div>

      <div className="service-market-body">
        <div className="service-market-meta">
          <span>
            {
              serviceCategoryLabels[
                service.category
              ]
            }
          </span>
          <b>{service.aiMatchScore}% تطابق ذكي</b>
        </div>

        <h2>{service.title}</h2>

        <p>{service.description}</p>

        <div className="service-smart-facts">
          <span>
            {service.openNow
              ? "مفتوح الآن"
              : "مغلق حاليًا"}
          </span>
          <span>
            {service.distanceKm === 0
              ? "خدمة رقمية"
              : `${service.distanceKm} كم`}
          </span>
          <span>
            {service.estimatedDurationMinutes} دقيقة
          </span>
        </div>

        <div className="service-provider-row">
          <div>
            <strong>{service.providerName}</strong>
            <small>
              {service.city} · استجابة خلال{" "}
              {service.responseMinutes} دقائق
            </small>
          </div>

          <b>★ {service.rating}</b>
        </div>

        <div className="service-market-footer">
          <div>
            <span>يبدأ من</span>
            <strong>
              {service.discountPercent > 0
                ? formatPrice(discountedPrice)
                : formatPrice(service.priceFrom)}{" "}
              د.إ
            </strong>
            {service.discountPercent > 0 ? (
              <del>
                {formatPrice(service.priceFrom)} د.إ
              </del>
            ) : null}
          </div>

          <Link href={`/services/${service.slug}`}>
            عرض وحجز
          </Link>
        </div>
      </div>
    </article>
  );
}
