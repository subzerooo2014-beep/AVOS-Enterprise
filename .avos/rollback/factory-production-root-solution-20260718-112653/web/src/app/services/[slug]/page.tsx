import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  ServiceBookingPanel,
} from "@/components/service-booking-panel";
import {
  findServiceBySlug,
  automotiveServices,
  serviceCategoryLabels,
} from "@/data/services";
import { getApiStatus } from "@/lib/api";

interface ServiceDetailsProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return automotiveServices.map(
    (service) => ({
      slug: service.slug,
    }),
  );
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsProps) {
  const { slug } = await params;
  const service =
    findServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell service-details-page">
        <div className="details-breadcrumb">
          <Link href="/">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/services">
            الخدمات
          </Link>
          <span>/</span>
          <strong>
            {service.title}
          </strong>
        </div>

        <section className="service-details-hero">
          <img
            src={service.image}
            alt={service.title}
          />

          <div>
            <span>
              {
                serviceCategoryLabels[
                  service.category
                ]
              }
            </span>
            <h1>{service.title}</h1>
            <p>{service.description}</p>

            <div className="service-detail-badges">
              {service.verified ? (
                <b>مزود موثق</b>
              ) : null}
              {service.mobileService ? (
                <b>خدمة متنقلة</b>
              ) : null}
              {service.instantBooking ? (
                <b>حجز فوري</b>
              ) : null}
            </div>
          </div>
        </section>

        <section className="service-details-grid">
          <div className="service-information">
            <span>تفاصيل الخدمة</span>
            <h2>
              ماذا تشمل هذه الخدمة؟
            </h2>

            <div className="service-highlights">
              {service.highlights.map(
                (highlight) => (
                  <div key={highlight}>
                    <i>✓</i>
                    {highlight}
                  </div>
                ),
              )}
            </div>

            <div className="service-provider-profile">
              <div>
                <span>مزود الخدمة</span>
                <h2>
                  {service.providerName}
                </h2>
                <p>
                  تقييم {service.rating} من{" "}
                  {service.reviews} مراجعة.
                </p>
              </div>

              <Link
                href={`/providers/${service.providerId}`}
              >
                عرض المزود
              </Link>
            </div>
          </div>

          <ServiceBookingPanel
            service={service}
          />
        </section>
      </div>

      <Footer />
    </main>
  );
}
