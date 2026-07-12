import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceMarketplace } from "@/components/service-marketplace";
import { getApiStatus } from "@/lib/api";

export default async function ServicesPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <section className="services-hero services-hero-v2">
        <div className="shell">
          <span>AVOS Services Platform V2</span>
          <h1>
            خدمتك المناسبة، بأفضل مزود، في أسرع وقت.
          </h1>
          <p>
            سوق خدمات ذكي يجمع الصيانة والفحص والعناية
            والتأمين والتمويل وقطع الغيار مع حجز مباشر
            وتوصيات مدعومة بذكاء AVOS.
          </p>
        </div>
      </section>

      <div className="shell">
        <ServiceMarketplace />
      </div>

      <Footer />
    </main>
  );
}
