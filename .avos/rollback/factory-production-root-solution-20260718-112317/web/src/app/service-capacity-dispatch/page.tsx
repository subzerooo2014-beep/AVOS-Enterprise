import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "السعة والتوزيع الذكي | AVOS",
  description: "إدارة السعة، التوزيع، المناطق، والفنيين بشكل لحظي.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[9]} />;
}
