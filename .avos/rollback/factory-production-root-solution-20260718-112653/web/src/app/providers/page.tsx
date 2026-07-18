import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  ProviderCard,
} from "@/components/provider-card";
import {
  serviceProviders,
} from "@/data/providers";
import { getApiStatus } from "@/lib/api";

export default async function ProvidersPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <section className="providers-hero">
        <div className="shell">
          <span>AVOS Verified Network</span>
          <h1>
            الوكالات والمعارض ومزودو الخدمات.
          </h1>
          <p>
            شبكة موثقة مع تقييمات حقيقية
            وأداء قابل للقياس.
          </p>
        </div>
      </section>

      <section className="shell providers-grid">
        {serviceProviders.map(
          (provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
            />
          ),
        )}
      </section>

      <Footer />
    </main>
  );
}
