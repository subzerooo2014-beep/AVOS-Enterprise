import { WorkshopGrid } from "./components/w-or-ks-ho-pg-ri-d";

export default function WorkshopsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">Ø§Ù„ÙˆØ±Ø´ ÙˆØ§Ù„ØµÙŠØ§Ù†Ø©</h1>
        <p className="mt-3 text-slate-600">ÙˆØ±Ø´ Ù…ÙˆØ«ÙˆÙ‚Ø© ÙˆØ®Ø¯Ù…Ø§Øª Ù‚Ø±ÙŠØ¨Ø©.</p>
        <div className="mt-8">
          <WorkshopGrid />
        </div>
      </div>
    </main>
  );
}