"use client";

import { useState } from "react";
import { SiteHeader } from "../../components/site-header";

const initialBids = [
  { bidder: "مزايد 102", amount: 115000, time: "منذ دقيقة" },
  { bidder: "مزايد 087", amount: 112000, time: "منذ 3 دقائق" },
  { bidder: "مزايد 044", amount: 108000, time: "منذ 6 دقائق" },
];

export default function AuctionDetailsPage() {
  const [amount, setAmount] = useState("118000");
  const [bids, setBids] = useState(initialBids);

  function submitBid() {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= bids[0].amount) {
      return;
    }

    setBids([
      { bidder: "أنت", amount: numericAmount, time: "الآن" },
      ...bids,
    ]);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="h-[430px] rounded-3xl bg-gradient-to-br from-slate-300 to-slate-200" />

          <div className="mt-6 rounded-3xl border bg-white p-7">
            <h1 className="text-3xl font-black">Toyota Land Cruiser 2024</h1>
            <p className="mt-3 text-slate-600">
              مزاد مباشر مع تحقق الهوية وسجل عروض شفاف.
            </p>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border bg-white p-7 shadow-sm">
          <div className="text-sm text-red-600">مباشر الآن</div>
          <div className="mt-2 text-4xl font-black">
            AED {bids[0].amount.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-slate-500">ينتهي خلال 01:24:16</div>

          <div className="mt-6 flex gap-3">
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border px-4 py-3"
              placeholder="قيمة العرض"
            />
            <button
              onClick={submitBid}
              className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white"
            >
              قدم عرضك
            </button>
          </div>

          <div className="mt-7">
            <h2 className="text-xl font-black">سجل العروض</h2>
            <div className="mt-4 grid gap-3">
              {bids.map((bid, index) => (
                <div
                  key={`${bid.bidder}-${bid.amount}-${index}`}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                >
                  <div>
                    <div className="font-bold">{bid.bidder}</div>
                    <div className="text-xs text-slate-500">{bid.time}</div>
                  </div>
                  <div className="font-black">
                    AED {bid.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}