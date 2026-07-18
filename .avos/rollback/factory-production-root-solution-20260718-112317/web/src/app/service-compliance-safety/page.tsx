import { ServicePlatformAcceleratedDashboard } from "@/components/service-platform-accelerated/service-platform-accelerated-dashboard";
import { acceleratedModules } from "@/data/service-platform-accelerated";

export const metadata = {
  title: "الامتثال والسلامة | AVOS",
  description: "التراخيص، السلامة، المخالفات، والتدقيق التشغيلي.",
};

export default function Page() {
  return <ServicePlatformAcceleratedDashboard config={acceleratedModules[13]} />;
}
