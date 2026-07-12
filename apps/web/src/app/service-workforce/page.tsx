import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "القوى العاملة والفنيون | AVOS",
  description: "مهارات الفنيين، الأداء، الورديات، والتدريب.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[12]} />;
}
