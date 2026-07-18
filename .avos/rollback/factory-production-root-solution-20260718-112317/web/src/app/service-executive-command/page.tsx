import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "القيادة التنفيذية للخدمات | AVOS",
  description: "لوحة تنفيذية موحدة لاتخاذ القرار وإدارة المنصة بالكامل.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[20]} />;
}
