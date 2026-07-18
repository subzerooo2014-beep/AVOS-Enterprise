import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  findProviderBySlug,
  serviceProviders,
} from "@/data/providers";
import {
  automotiveServices,
} from "@/data/services";
import { vehicles } from "@/data/vehicles";
import { getApiStatus } from "@/lib/api";

interface ProviderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return serviceProviders.map(
    (provider) => ({
      slug: provider.slug,
    }),
  );
}

export default async function ProviderPage({
  params,
}: ProviderPageProps) {
  const { slug } = await params;
  const provider =
    findProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const apiStatus = await getApiStatus();

  const providerServices =
    automotiveServices.filter(
      (service) =>
        service.providerId ===
        provider.id,
    );

  const providerVehicles =
    provider.type === "dealer"
      ? vehicles.slice(0, 4)
      : [];

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="provider-profile-page">
        <section className="provider-profile-cover">
          <img
            src={provider.cover}
            alt={provider.name}
          />
          <div className="shell provider-profile-header">
            <div className="provider-profile-logo">
              {provider.logo}
            </div>

            <div>
              <span>
                {provider.verified
                  ? "مزود موثق من AVOS"
                  : "مزود خدمة"}
              </span>
              <h1>{provider.name}</h1>
              <p>
                {provider.city} · تقييم{" "}
                {provider.rating}
              </p>
            </div>

            <button className="button button-primary">
              تواصل الآن
            </button>
          </div>
        </section>

        <div className="shell provider-profile-content">
          <section className="provider-about">
            <span>عن المزود</span>
            <h2>
              خبرة موثقة وخدمة قابلة للقياس
            </h2>
            <p>{provider.description}</p>

            <div className="provider-certifications">
              {provider.certifications.map(
                (certification) => (
                  <b key={certification}>
                    {certification}
                  </b>
                ),
              )}
            </div>

            <div className="provider-stats">
              <div>
                <strong>
                  {provider.completedJobs}
                </strong>
                <span>عملية مكتملة</span>
              </div>
              <div>
                <strong>
                  {provider.reviews}
                </strong>
                <span>مراجعة</span>
              </div>
              <div>
                <strong>
                  {provider.responseMinutes}د
                </strong>
                <span>متوسط الاستجابة</span>
              </div>
            </div>
          </section>

          {providerServices.length > 0 ? (
            <section className="provider-offerings">
              <div>
                <span>الخدمات</span>
                <h2>
                  الخدمات المتاحة
                </h2>
              </div>

              {providerServices.map(
                (service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                    />
                    <div>
                      <strong>
                        {service.title}
                      </strong>
                      <span>
                        يبدأ من{" "}
                        {service.priceFrom} د.إ
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </section>
          ) : null}

          {providerVehicles.length > 0 ? (
            <section className="provider-offerings">
              <div>
                <span>المخزون</span>
                <h2>
                  سيارات متاحة
                </h2>
              </div>

              {providerVehicles.map(
                (vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`/vehicles/${vehicle.slug}`}
                  >
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                    />
                    <div>
                      <strong>
                        {vehicle.title}
                      </strong>
                      <span>
                        {vehicle.price} د.إ
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </section>
          ) : null}
        </div>
      </div>

      <Footer />
    </main>
  );
}
