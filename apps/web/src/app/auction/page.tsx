import Link from "next/link";
import { SiteHeader } from "../components/site-header";

const auctions = [
  {
    id: "land-cruiser-live",
    title: "Toyota Land Cruiser 2024",
    currentBid: "AED 115,000",
    bids: 18,
    timeLeft: "01:24:16",
    trust: 96,
  },
  {
    id: "patrol-live",
    title: "Nissan Patrol 2023",
    currentBid: "AED 98,000",
    bids: 12,
    timeLeft: "02:10:08",
    trust: 93,
  },
];

export default function AuctionPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <h1 className="text-4xl font-black">المزادات المباشرة</h1>
          <p className="mt-2 text-slate-500">
            تابع المزادات، قدم عرضك، وشاهد تاريخ العروض مباشرة.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {auctions.map((auction) => (
            <article key={auction.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
              <div className="h-64 bg-gradient-to-br from-slate-300 to-slate-200" />
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black">{auction.title}</h2>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    مباشر
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">العرض الحالي</div>
                    <div className="mt-1 font-black">{auction.currentBid}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">العروض</div>
                    <div className="mt-1 font-black">{auction.bids}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">الوقت</div>
                    <div className="mt-1 font-black">{auction.timeLeft}</div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-700">
                    نسبة الثقة: {auction.trust}%
                  </span>
                  <Link
                    href={`/auction/${auction.id}`}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white"
                  >
                    دخول المزاد
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}