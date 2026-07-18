import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  LiveBidPanel,
} from "@/components/live-bid-panel";
import {
  auctionListings,
  findAuctionBySlug,
} from "@/data/auctions";
import {
  formatPrice,
} from "@/lib/vehicle-search";
import { getApiStatus } from "@/lib/api";

interface AuctionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return auctionListings.map(
    (auction) => ({
      slug: auction.slug,
    }),
  );
}

export default async function AuctionPage({
  params,
}: AuctionPageProps) {
  const { slug } = await params;
  const auction =
    findAuctionBySlug(slug);

  if (!auction) {
    notFound();
  }

  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell auction-details-page">
        <div className="details-breadcrumb">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/auctions">
            المزادات
          </Link>
          <span>/</span>
          <strong>
            {auction.title}
          </strong>
        </div>

        <section className="auction-details-grid">
          <div className="auction-main">
            <img
              src={auction.image}
              alt={auction.title}
            />

            <div>
              <span>مزاد موثق</span>
              <h1>{auction.title}</h1>
              <p>
                {auction.city} ·{" "}
                {auction.seller}
              </p>

              <div className="auction-metrics">
                <div>
                  <span>السعر الاحتياطي</span>
                  <strong>
                    {formatPrice(
                      auction.reservePrice,
                    )}{" "}
                    د.إ
                  </strong>
                </div>
                <div>
                  <span>المزايدات</span>
                  <strong>
                    {auction.bids}
                  </strong>
                </div>
                <div>
                  <span>Auto Bid</span>
                  <strong>
                    {auction.autoBidEnabled
                      ? "متاح"
                      : "غير متاح"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <LiveBidPanel
            auction={auction}
          />
        </section>
      </div>

      <Footer />
    </main>
  );
}
