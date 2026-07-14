import { InsuranceOffers } from "./components/i-ns-ur-an-ce-of-fe-rs";

export default function InsurancePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">Ø§Ù„ØªØ£Ù…ÙŠÙ†</h1>
        <p className="mt-3 text-slate-600">Ù‚Ø§Ø±Ù† Ø¹Ø±ÙˆØ¶ Ø§Ù„ØªØ£Ù…ÙŠÙ† Ø¨Ø³Ø±Ø¹Ø©.</p>
        <div className="mt-8">
          <InsuranceOffers />
        </div>
      </div>
    </main>
  );
}