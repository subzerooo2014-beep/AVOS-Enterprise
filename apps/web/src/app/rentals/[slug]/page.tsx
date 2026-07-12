import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  findRentalBySlug,
  rentalVehicles,
} from "@/data/rentals";
import {
  formatPrice,
} from "@/lib/vehicle-search";
import { getApiStatus } from "@/lib/api";

interface RentalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return rentalVehicles.map(
    (rental) => ({
      slug: rental.slug,
    }),
  );
}

export default async function RentalPage({
  params,
}: RentalPageProps) {
  const { slug } = await params;
  const rental =
    findRentalBySlug(slug);

  if (!rental) {
    notFound();
  }

  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell rental-details-page">
        <div className="details-breadcrumb">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/rentals">
            التأجير
          </Link>
          <span>/</span>
          <strong>{rental.title}</strong>
        </div>

        <section className="rental-details-card">
          <img
            src={rental.image}
            alt={rental.title}
          />

          <div>
            <span>
              {rental.availableNow
                ? "متاح الآن"
                : "غير متاح حاليًا"}
            </span>
            <h1>{rental.title}</h1>
            <p>
              {rental.city} ·{" "}
              {rental.provider} · تقييم{" "}
              {rental.rating}
            </p>

            <div className="rental-detail-prices">
              <div>
                <span>يومي</span>
                <strong>
                  {formatPrice(
                    rental.dailyPrice,
                  )}{" "}
                  د.إ
                </strong>
              </div>
              <div>
                <span>شهري</span>
                <strong>
                  {formatPrice(
                    rental.monthlyPrice,
                  )}{" "}
                  د.إ
                </strong>
              </div>
              <div>
                <span>التأمين</span>
                <strong>
                  {formatPrice(
                    rental.deposit,
                  )}{" "}
                  د.إ
                </strong>
              </div>
            </div>

            <div className="rental-features">
              {rental.features.map(
                (feature) => (
                  <b key={feature}>
                    ✓ {feature}
                  </b>
                ),
              )}
            </div>

            <button className="button button-primary button-large">
              احجز الآن
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
