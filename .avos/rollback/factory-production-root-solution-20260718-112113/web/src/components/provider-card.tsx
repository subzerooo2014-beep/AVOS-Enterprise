import Link from "next/link";
import {
  ServiceProvider,
} from "@/data/providers";

export function ProviderCard({
  provider,
}: {
  provider: ServiceProvider;
}) {
  return (
    <article className="provider-card">
      <img
        src={provider.cover}
        alt={provider.name}
      />

      <div className="provider-logo">
        {provider.logo}
      </div>

      <div className="provider-card-body">
        <span>
          {provider.verified
            ? "مزود موثق"
            : "مزود خدمة"}
        </span>

        <h2>{provider.name}</h2>

        <p>{provider.description}</p>

        <div className="provider-metrics">
          <div>
            <strong>
              {provider.rating}
            </strong>
            <span>التقييم</span>
          </div>
          <div>
            <strong>
              {provider.completedJobs}
            </strong>
            <span>عملية</span>
          </div>
          <div>
            <strong>
              {provider.responseMinutes}د
            </strong>
            <span>الاستجابة</span>
          </div>
        </div>

        <Link
          href={`/providers/${provider.slug}`}
        >
          عرض الملف الكامل
        </Link>
      </div>
    </article>
  );
}
