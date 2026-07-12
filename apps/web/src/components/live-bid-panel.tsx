"use client";

import { useMemo, useState } from "react";
import {
  AuctionListing,
} from "@/data/auctions";
import {
  formatPrice,
} from "@/lib/vehicle-search";
import {
  useAuctionStore,
} from "@/store/auction-store";

export function LiveBidPanel({
  auction,
}: {
  auction: AuctionListing;
}) {
  const bids = useAuctionStore(
    (state) => state.bids,
  );

  const placeBid = useAuctionStore(
    (state) => state.placeBid,
  );

  const setAutoBid = useAuctionStore(
    (state) => state.setAutoBid,
  );

  const latestLocalBid = useMemo(
    () =>
      bids
        .filter(
          (bid) =>
            bid.auctionId === auction.id,
        )
        .at(-1),
    [auction.id, bids],
  );

  const currentBid =
    latestLocalBid?.amount ??
    auction.currentBid;

  const [amount, setAmount] = useState(
    currentBid + 5000,
  );

  const [autoLimit, setAutoLimit] =
    useState(currentBid + 25000);

  return (
    <aside className="live-bid-panel">
      <span>AVOS Live Auction</span>
      <h2>قدّم مزايدتك</h2>

      <div className="current-bid-box">
        <span>المزايدة الحالية</span>
        <strong>
          {formatPrice(currentBid)} د.إ
        </strong>
        <small>
          {auction.bids +
            bids.filter(
              (bid) =>
                bid.auctionId ===
                auction.id,
            ).length}{" "}
          مزايدة
        </small>
      </div>

      <label>
        <span>قيمة المزايدة</span>
        <input
          type="number"
          value={amount}
          onChange={(event) =>
            setAmount(
              Number(event.target.value),
            )
          }
        />
      </label>

      <button
        className="button button-primary"
        type="button"
        onClick={() =>
          placeBid(
            auction.id,
            Math.max(
              amount,
              currentBid + 1000,
            ),
          )
        }
      >
        تأكيد المزايدة
      </button>

      <div className="auto-bid-box">
        <span>المزايدة التلقائية</span>
        <input
          type="number"
          value={autoLimit}
          onChange={(event) =>
            setAutoLimit(
              Number(event.target.value),
            )
          }
        />
        <button
          type="button"
          onClick={() =>
            setAutoBid(
              auction.id,
              autoLimit,
            )
          }
        >
          تفعيل Auto Bid
        </button>
      </div>

      <small>
        جميع المزايدات ملزمة بعد
        تأكيد الهوية والضمان المالي.
      </small>
    </aside>
  );
}
