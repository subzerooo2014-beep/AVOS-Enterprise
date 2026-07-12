import Link from "next/link";
import {
  AutomotiveService,
  serviceCategoryLabels,
} from "@/data/services";
import {
  formatPrice,
} from "@/lib/vehicle-search";

export function ServiceCard({
  service,
}: {
  service: AutomotiveService;
}) {
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
      </div>

      <div className="service-market-body">
        <span>
          {
            serviceCategoryLabels[
              service.category
            ]
          }
        </span>

        <h2>{service.title}</h2>

        <p>{service.description}</p>

        <div className="service-provider-row">
          <div>
            <strong>
              {service.providerName}
            </strong>
            <small>
              {service.city} · استجابة خلال{" "}
              {service.responseMinutes} دقائق
            </small>
          </div>

          <b>
            ★ {service.rating}
          </b>
        </div>

        <div className="service-market-footer">
          <div>
            <span>يبدأ من</span>
            <strong>
              {formatPrice(
                service.priceFrom,
              )}{" "}
              د.إ
            </strong>
          </div>

          <Link
            href={`/services/${service.slug}`}
          >
            عرض وحجز
          </Link>
        </div>
      </div>
    </article>
  );
}
