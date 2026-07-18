import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "عمليات الأسطول الخدمي | AVOS",
  description: "تشغيل المركبات الخدمية، المسارات، الوقود، والجاهزية.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[10]} />;
}
