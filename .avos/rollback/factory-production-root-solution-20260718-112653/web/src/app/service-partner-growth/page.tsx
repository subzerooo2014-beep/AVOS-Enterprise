import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "نمو الشركاء | AVOS",
  description: "تمكين الشركاء، التوسع، الجودة، والفرص التجارية.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[16]} />;
}
