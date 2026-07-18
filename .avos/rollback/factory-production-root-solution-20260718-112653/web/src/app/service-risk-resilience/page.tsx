import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "المخاطر والمرونة | AVOS",
  description: "المخاطر التشغيلية، الاستمرارية، السيناريوهات، والتعافي.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[17]} />;
}
