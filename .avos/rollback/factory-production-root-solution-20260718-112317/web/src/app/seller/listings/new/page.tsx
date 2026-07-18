import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  SellerNavigation,
} from "@/components/seller-navigation";
import {
  SmartListingForm,
} from "@/components/smart-listing-form";
import { getApiStatus } from "@/lib/api";

export default async function NewListingPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell seller-page">
        <SellerNavigation />

        <div className="seller-section-heading">
          <span>AVOS Smart Publisher</span>
          <h1>أنشئ إعلانًا احترافيًا</h1>
          <p>
            AVOS يساعدك في الوصف والتسعير والجودة.
          </p>
        </div>

        <SmartListingForm />
      </div>
      <Footer />
    </main>
  );
}
