import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProviderBookingCenter } from "@/components/provider-workspace/provider-booking-center";
import { getApiStatus } from "@/lib/api";

export default async function ProviderBookingsPage() {
  const apiStatus = await getApiStatus();
  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell provider-booking-center-page">
        <ProviderBookingCenter />
      </div>
      <Footer />
    </main>
  );
}
