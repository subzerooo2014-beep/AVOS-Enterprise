import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  VehicleMarketplace,
} from "@/components/vehicle-marketplace";
import { getApiStatus } from "@/lib/api";

export const metadata: Metadata = {
  title: "السيارات | AVOS",
  description:
    "ابحث عن السيارات الجديدة والمستعملة في الإمارات عبر سوق AVOS الذكي.",
};

export default async function VehiclesPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="marketplace-hero">
        <div className="shell">
          <span>AVOS Vehicle Marketplace</span>
          <h1>
            ابحث عن سيارتك التالية بذكاء.
          </h1>
          <p>
            فلاتر متقدمة، إعلانات موثقة، وأسعار واضحة.
          </p>
        </div>
      </div>
      <div className="shell">
        <VehicleMarketplace />
      </div>
      <Footer />
    </main>
  );
}
