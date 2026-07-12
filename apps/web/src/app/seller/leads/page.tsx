import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  SellerNavigation,
} from "@/components/seller-navigation";
import {
  SellerLeadBoard,
} from "@/components/seller-lead-board";
import { getApiStatus } from "@/lib/api";

export default async function SellerLeadsPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell seller-page">
        <SellerNavigation />

        <div className="seller-section-heading">
          <span>AVOS Lead Intelligence</span>
          <h1>إدارة العملاء المحتملين</h1>
          <p>
            رتّب الفرص وحدّث مراحل البيع.
          </p>
        </div>

        <SellerLeadBoard />
      </div>
      <Footer />
    </main>
  );
}
