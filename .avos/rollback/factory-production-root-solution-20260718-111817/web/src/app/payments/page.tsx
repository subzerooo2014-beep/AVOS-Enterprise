import { SiteHeader } from "../components/site-header";

export default function PaymentsPage() {
  const payments = [
    ["دفعة حجز مركبة", "AED 5,000", "مكتمل"],
    ["رسوم فحص", "AED 450", "مكتمل"],
    ["دفعة تأمين", "AED 5,900", "قيد المعالجة"],
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-black">المدفوعات والفواتير</h1>
        <div className="mt-8 overflow-hidden rounded-3xl border bg-white">
          {payments.map(([label, amount, status]) => (
            <div key={label} className="flex items-center justify-between border-b p-5 last:border-b-0">
              <div>
                <div className="font-black">{label}</div>
                <div className="text-sm text-slate-500">{status}</div>
              </div>
              <div className="font-black">{amount}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}