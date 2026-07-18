import { ServiceHealthObservabilityCenter } from "@/components/service-health-observability/service-health-observability-center";

export const metadata = {
  title: "صحة الخدمات والمراقبة | AVOS",
  description: "مراقبة صحة الخدمات والأداء والأخطاء والاعتماديات داخل AVOS.",
};

export default function ServiceHealthObservabilityPage() {
  return <ServiceHealthObservabilityCenter />;
}
