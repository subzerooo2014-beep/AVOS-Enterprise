import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  autoParts,
  findPartBySlug,
} from "@/data/parts";
import {
  formatPrice,
} from "@/lib/vehicle-search";
import { getApiStatus } from "@/lib/api";

interface PartPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return autoParts.map((part) => ({
    slug: part.slug,
  }));
}

export default async function PartPage({
  params,
}: PartPageProps) {
  const { slug } = await params;
  const part = findPartBySlug(slug);

  if (!part) {
    notFound();
  }

  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell part-details-page">
        <div className="details-breadcrumb">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/parts">
            قطع الغيار
          </Link>
          <span>/</span>
          <strong>{part.title}</strong>
        </div>

        <section className="part-details-card">
          <img
            src={part.image}
            alt={part.title}
          />

          <div>
            <span>
              {part.verified
                ? "بائع موثق"
                : "إعلان"}
            </span>
            <h1>{part.title}</h1>
            <p>
              {part.brand} · {part.city} ·{" "}
              {part.seller}
            </p>

            <strong>
              {formatPrice(part.price)} د.إ
            </strong>

            <div className="compatibility-box">
              <span>
                AVOS Compatibility Check
              </span>
              <h2>
                المركبات المتوافقة
              </h2>
              {part.compatibleVehicles.map(
                (vehicle) => (
                  <b key={vehicle}>
                    ✓ {vehicle}
                  </b>
                ),
              )}
            </div>

            <button className="button button-primary button-large">
              أضف إلى السلة
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
