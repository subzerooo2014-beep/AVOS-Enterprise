import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  AuctionCard,
} from "@/components/auction-card";
import {
  auctionListings,
} from "@/data/auctions";
import { getApiStatus } from "@/lib/api";

export default async function AuctionsPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <section className="auction-hero">
        <div className="shell">
          <span>AVOS Smart Auctions</span>
          <h1>
            مزادات موثقة ومزايدة ذكية.
          </h1>
          <p>
            سيارات وأرقام مميزة مع Auto Bid
            وضمان مالي وتوثيق كامل.
          </p>
        </div>
      </section>

      <section className="shell auction-grid">
        {auctionListings.map(
          (auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
            />
          ),
        )}
      </section>

      <Footer />
    </main>
  );
}
