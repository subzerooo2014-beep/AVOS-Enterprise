import Link from "next/link";
import {
  AuctionListing,
} from "@/data/auctions";
import {
  formatPrice,
} from "@/lib/vehicle-search";

export function AuctionCard({
  auction,
}: {
  auction: AuctionListing;
}) {
  return (
    <article className="auction-card">
      <div className="auction-card-image">
        <img
          src={auction.image}
          alt={auction.title}
        />
        <span>مزاد مباشر</span>
        <b>{auction.bids} مزايدة</b>
      </div>

      <div className="auction-card-body">
        <span>
          {auction.category === "vehicle"
            ? "سيارة"
            : "رقم مميز"}
        </span>
        <h2>{auction.title}</h2>
        <p>
          {auction.city} · {auction.seller}
        </p>

        <div className="auction-bid-row">
          <div>
            <span>المزايدة الحالية</span>
            <strong>
              {formatPrice(
                auction.currentBid,
              )}{" "}
              د.إ
            </strong>
          </div>
          <div>
            <span>ينتهي</span>
            <strong>
              {new Date(
                auction.endsAt,
              ).toLocaleDateString("ar-AE")}
            </strong>
          </div>
        </div>

        <Link
          href={`/auctions/${auction.slug}`}
        >
          دخول المزاد
        </Link>
      </div>
    </article>
  );
}
