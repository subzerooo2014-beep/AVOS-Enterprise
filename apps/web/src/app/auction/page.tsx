import { AuctionGrid } from "./components/a-uc-ti-on-gr-id";

export default function AuctionPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">Ø§Ù„Ù…Ø²Ø§Ø¯Ø§Øª</h1>
        <p className="mt-3 text-slate-600">Ù…Ø²Ø§Ø¯Ø§Øª Ù…Ø­Ù„ÙŠØ© ÙˆØ¯ÙˆÙ„ÙŠØ© Ù…Ø¹ Ø¹Ø²Ù….</p>
        <div className="mt-8">
          <AuctionGrid />
        </div>
      </div>
    </main>
  );
}