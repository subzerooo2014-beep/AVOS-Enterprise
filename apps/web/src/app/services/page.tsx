import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  ServiceMarketplace,
} from "@/components/service-marketplace";
import { getApiStatus } from "@/lib/api";

export default async function ServicesPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <section className="services-hero">
        <div className="shell">
          <span>
            AVOS Automotive Services
          </span>
          <h1>
            كل خدمات سيارتك في مكان واحد.
          </h1>
          <p>
            فحص، صيانة، تأمين، نقل، ضمان
            وعناية من مزودين موثقين.
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
