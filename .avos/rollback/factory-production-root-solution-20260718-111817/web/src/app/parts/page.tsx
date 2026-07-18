import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  PartCard,
} from "@/components/part-card";
import { autoParts } from "@/data/parts";
import { getApiStatus } from "@/lib/api";

export default async function PartsPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <section className="parts-hero">
        <div className="shell">
          <span>AVOS Parts Marketplace</span>
          <h1>
            قطع غيار متوافقة وموثقة.
          </h1>
          <p>
            أصلية، تجارية، مستعملة ومجددة
            مع فحص التوافق قبل الشراء.
          </p>
        </div>
      </section>

      <section className="shell parts-grid">
        {autoParts.map((part) => (
          <PartCard
            key={part.id}
            part={part}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}
