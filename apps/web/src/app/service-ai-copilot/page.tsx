import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "مساعد الخدمات الذكي | AVOS",
  description: "قرارات وتوصيات وتحليلات تشغيلية مدعومة بالذكاء الصناعي.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[19]} />;
}
