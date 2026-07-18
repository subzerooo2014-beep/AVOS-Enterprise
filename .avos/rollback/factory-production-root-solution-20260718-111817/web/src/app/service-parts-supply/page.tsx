import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "قطع الغيار وسلسلة الإمداد | AVOS",
  description: "المخزون، الموردون، النقص، وإعادة الطلب الذكي.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[11]} />;
}
