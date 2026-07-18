import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "ذكاء سوق الخدمات | AVOS",
  description: "تحليل العرض والطلب والأسعار والفرص في سوق الخدمات.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[7]} />;
}
