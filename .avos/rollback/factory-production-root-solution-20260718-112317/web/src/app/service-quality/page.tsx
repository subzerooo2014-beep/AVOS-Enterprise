import { ServiceQualityDashboard } from "@/components/service-quality/service-quality-dashboard";

export const metadata = {
  title: "جودة الخدمات وتجربة العملاء | AVOS",
  description:
    "مركز AVOS الذكي لمراقبة جودة الخدمات ورضا العملاء واسترداد التجربة.",
};

export default function ServiceQualityPage() {
  return <ServiceQualityDashboard />;
}
