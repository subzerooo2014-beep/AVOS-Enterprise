import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "التسعير والإيرادات | AVOS",
  description: "التسعير الديناميكي، الهوامش، الإيرادات، والفرص المالية.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[8]} />;
}
