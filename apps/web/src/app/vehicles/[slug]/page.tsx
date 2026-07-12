import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  findVehicleBySlug,
  vehicles,
} from "@/data/vehicles";
import {
  formatMileage,
  formatPrice,
} from "@/lib/vehicle-search";
import { getApiStatus } from "@/lib/api";
import { VehicleIntelligencePanel } from "@/components/vehicle-intelligence-panel";
import { VehicleServiceBundle } from "@/components/vehicle-service-bundle";
import { FinanceCalculator } from "@/components/finance-calculator";
import { SmartOfferPanel } from "@/components/smart-offer-panel";
import { BookingForm } from "@/components/booking-form";

interface VehicleDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export async function generateMetadata({
  params,
}: VehicleDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = findVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "السيارة غير موجودة | AVOS",
    };
  }

  return {
    title: `${vehicle.title} ${vehicle.year} | AVOS`,
    description: vehicle.description,
  };
}

export default async function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {
  const { slug } = await params;
  const vehicle = findVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell vehicle-details-page">
        <div className="details-breadcrumb">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/vehicles">السيارات</Link>
          <span>/</span>
          <strong>{vehicle.title}</strong>
        </div>

        <section className="vehicle-gallery">
          <div className="gallery-main">
            <img
              src={vehicle.gallery[0]}
              alt={vehicle.title}
            />
          </div>
          <div className="gallery-side">
            {vehicle.gallery.slice(1).map((image) => (
              <img
                key={image}
                src={image}
                alt={vehicle.title}
              />
            ))}
          </div>
        </section>

        <section className="vehicle-details-grid">
          <div className="vehicle-main-info">
            <div className="details-title-row">
              <div>
                <span>
                  {vehicle.verified
                    ? "إعلان موثق من AVOS"
                    : "إعلان"}
                </span>
                <h1>{vehicle.title}</h1>
                <p>
                  {vehicle.year} · {vehicle.city} ·{" "}
                  {formatMileage(vehicle.mileage)} كم
                </p>
              </div>
              <strong>
                {formatPrice(vehicle.price)} د.إ
              </strong>
            </div>

            <div className="details-description">
              <h2>وصف السيارة</h2>
              <p>{vehicle.description}</p>
            </div>

            <div className="specifications-grid">
              {Object.entries(vehicle.specs).map(
                ([key, value]) => (
                  <div key={key}>
                    <span>{key}</span>
                    <strong>{value}</strong>
                  </div>
                ),
              )}
            </div>
          </div>

          <aside className="seller-panel">
            <span>البائع</span>
            <h2>{vehicle.dealer}</h2>
            <p>
              بائع موثق على منصة AVOS مع سجل معاملات
              واضح وتقييم مرتفع.
            </p>

            <div className="seller-score">
              <div>
                <strong>4.9</strong>
                <span>التقييم</span>
              </div>
              <div>
                <strong>128</strong>
                <span>إعلانًا</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>استجابة</span>
              </div>
            </div>

            <button className="button button-primary button-large">
              تواصل مع البائع
            </button>
            <button className="button button-secondary button-large">
              اطلب فحص AVOS
            </button>

            <small>
              لا تدفع أي مبلغ قبل التحقق من السيارة
              والبائع.
            </small>
          </aside>
        </section>

        <VehicleIntelligencePanel vehicle={vehicle} />

        <VehicleServiceBundle />

        <div className="commerce-intelligence-grid">
          <FinanceCalculator
            vehiclePrice={vehicle.price}
          />
          <SmartOfferPanel
            askingPrice={vehicle.price}
          />
        </div>

        <BookingForm
          vehicleTitle={vehicle.title}
          provider={vehicle.dealer}
        />

        <section className="avos-price-insight">
          <div>
            <span>AVOS Price Intelligence</span>
            <h2>تحليل السعر الذكي</h2>
            <p>
              السعر الحالي قريب من متوسط السوق ومناسب
              لحالة السيارة ومواصفاتها.
            </p>
          </div>
          <div className="price-meter">
            <div className="price-meter-track">
              <i style={{ width: "68%" }} />
            </div>
            <div>
              <span>أقل من السوق</span>
              <strong>سعر عادل</strong>
              <span>أعلى من السوق</span>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
