import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  RentalCard,
} from "@/components/rental-card";
import {
  rentalVehicles,
} from "@/data/rentals";
import { getApiStatus } from "@/lib/api";

export default async function RentalsPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <section className="rentals-hero">
        <div className="shell">
          <span>AVOS Smart Rentals</span>
          <h1>
            تأجير يومي وشهري بوضوح كامل.
          </h1>
          <p>
            قارن السعر والتأمين والحد اليومي
            واختر التوصيل إلى موقعك.
          </p>
        </div>
      </section>

      <section className="shell rentals-grid">
        {rentalVehicles.map((rental) => (
          <RentalCard
            key={rental.id}
            rental={rental}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}
