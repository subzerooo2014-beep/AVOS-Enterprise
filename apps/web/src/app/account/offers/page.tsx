import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  AccountNavigation,
} from "@/components/account-navigation";
import { getApiStatus } from "@/lib/api";

const offers = [
  {
    id: "offer-001",
    vehicle: "Range Rover Sport HSE",
    amount: "350,000 د.إ",
    status: "قيد التفاوض",
    updated: "منذ 25 دقيقة",
  },
  {
    id: "offer-002",
    vehicle: "Toyota Land Cruiser VXR",
    amount: "375,000 د.إ",
    status: "بانتظار الرد",
    updated: "منذ ساعتين",
  },
];

export default async function OffersPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell account-page">
        <AccountNavigation />

        <div className="account-section-heading">
          <span>AVOS Smart Offers</span>
          <h1>العروض والتفاوض</h1>
          <p>
            تابع عروضك وتوصيات محرك
            التفاوض الذكي.
          </p>
        </div>

        <div className="offer-list">
          {offers.map((offer) => (
            <article key={offer.id}>
              <div>
                <span>{offer.status}</span>
                <h2>{offer.vehicle}</h2>
                <p>{offer.updated}</p>
              </div>
              <strong>{offer.amount}</strong>
              <button className="button button-secondary">
                فتح التفاوض
              </button>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
