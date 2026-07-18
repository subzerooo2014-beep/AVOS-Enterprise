import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "العقود واتفاقيات الخدمة | AVOS",
  description: "إدارة العقود، الالتزامات، التجديدات، والغرامات.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[14]} />;
}
