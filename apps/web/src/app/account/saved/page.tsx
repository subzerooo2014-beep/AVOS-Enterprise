import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  AccountNavigation,
} from "@/components/account-navigation";
import { vehicles } from "@/data/vehicles";
import {
  formatPrice,
} from "@/lib/vehicle-search";
import { getApiStatus } from "@/lib/api";

export default async function SavedPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell account-page">
        <AccountNavigation />

        <div className="account-section-heading">
          <span>Saved by AVOS</span>
          <h1>المحفوظات</h1>
          <p>
            السيارات والمقارنات وعمليات
            البحث التي تتابعها.
          </p>
        </div>

        <div className="saved-grid">
          {vehicles
            .slice(0, 4)
            .map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.slug}`}
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.title}
                />
                <div>
                  <span>سيارة محفوظة</span>
                  <h2>
                    {vehicle.title}
                  </h2>
                  <strong>
                    {formatPrice(
                      vehicle.price,
                    )}{" "}
                    د.إ
                  </strong>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
