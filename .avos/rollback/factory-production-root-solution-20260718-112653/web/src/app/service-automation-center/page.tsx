import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "مركز أتمتة الخدمات | AVOS",
  description: "الأتمتة، القواعد، المشغلات، والعمليات الذكية.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[18]} />;
}
