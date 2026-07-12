import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { plateListings } from "@/data/plates";
import {
  formatPrice,
} from "@/lib/vehicle-search";
import { getApiStatus } from "@/lib/api";

export default async function PlatesPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <section className="plates-hero">
        <div className="shell">
          <span>AVOS Signature Numbers</span>
          <h1>سوق الأرقام المميزة</h1>
          <p>
            أرقام لوحات موثقة، تقييم ذكي، وصفقات
            آمنة داخل الإمارات.
          </p>
        </div>
      </section>

      <section className="shell plates-grid">
        {plateListings.map((plate) => (
          <article key={plate.id}>
            <div className="plate-visual">
              <span>{plate.emirate}</span>
              <strong>{plate.number}</strong>
              <b>{plate.code}</b>
            </div>

            <div className="plate-card-body">
              <span>
                {plate.rarity === "ultra"
                  ? "نادر جدًا"
                  : plate.rarity === "premium"
                    ? "مميز"
                    : "خاص"}
              </span>
              <h2>
                {plate.emirate} · {plate.code}{" "}
                {plate.number}
              </h2>
              <strong>
                {formatPrice(plate.price)} د.إ
              </strong>
              <small>
                بائع موثق: {plate.seller}
              </small>
              <button className="button button-primary">
                اطلب التفاوض الذكي
              </button>
            </div>
          </article>
        ))}
      </section>

      <Footer />
    </main>
  );
}
