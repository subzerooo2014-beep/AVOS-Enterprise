import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { vehicles } from "@/data/vehicles";
import {
  analyzeVehicle,
  estimateOwnership,
} from "@/lib/vehicle-intelligence";
import {
  formatMileage,
  formatPrice,
} from "@/lib/vehicle-search";
import { getApiStatus } from "@/lib/api";

interface ComparePageProps {
  searchParams: Promise<{
    ids?: string;
  }>;
}

export default async function ComparePage({
  searchParams,
}: ComparePageProps) {
  const params = await searchParams;
  const ids = (params.ids ?? "")
    .split(",")
    .filter(Boolean)
    .slice(0, 3);

  const selected = vehicles.filter((vehicle) =>
    ids.includes(vehicle.id),
  );

  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell compare-page">
        <div className="compare-page-heading">
          <span>AVOS Smart Compare</span>
          <h1>مقارنة السيارات بالذكاء الاصطناعي</h1>
          <p>
            مقارنة السعر، الاعتمادية، إعادة البيع،
            وتكلفة الملكية.
          </p>
        </div>

        {selected.length < 2 ? (
          <div className="empty-state">
            <strong>
              اختر سيارتين على الأقل للمقارنة
            </strong>
            <Link
              href="/vehicles"
              className="button button-primary"
            >
              العودة إلى السوق
            </Link>
          </div>
        ) : (
          <div className="compare-grid">
            {selected.map((vehicle) => {
              const intelligence =
                analyzeVehicle(vehicle);
              const ownership =
                estimateOwnership(vehicle);

              return (
                <article
                  key={vehicle.id}
                  className="compare-column"
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                  />

                  <div className="compare-column-title">
                    <span>
                      تقييم AVOS{" "}
                      {intelligence.overall}/100
                    </span>
                    <h2>{vehicle.title}</h2>
                    <strong>
                      {formatPrice(vehicle.price)} د.إ
                    </strong>
                  </div>

                  <div className="compare-score-ring">
                    {intelligence.overall}
                  </div>

                  <p className="compare-summary">
                    {intelligence.summary}
                  </p>

                  <dl>
                    <div>
                      <dt>السنة</dt>
                      <dd>{vehicle.year}</dd>
                    </div>
                    <div>
                      <dt>الممشى</dt>
                      <dd>
                        {formatMileage(
                          vehicle.mileage,
                        )}{" "}
                        كم
                      </dd>
                    </div>
                    <div>
                      <dt>الاعتمادية</dt>
                      <dd>
                        {intelligence.reliability}%
                      </dd>
                    </div>
                    <div>
                      <dt>إعادة البيع</dt>
                      <dd>
                        {intelligence.resale}%
                      </dd>
                    </div>
                    <div>
                      <dt>القيمة مقابل السعر</dt>
                      <dd>{intelligence.value}%</dd>
                    </div>
                    <div>
                      <dt>تكلفة 5 سنوات</dt>
                      <dd>
                        {formatPrice(
                          ownership.fiveYearTotal,
                        )}{" "}
                        د.إ
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`/vehicles/${vehicle.slug}`}
                    className="button button-secondary"
                  >
                    تفاصيل السيارة
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
