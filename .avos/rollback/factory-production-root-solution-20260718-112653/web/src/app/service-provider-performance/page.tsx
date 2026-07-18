import { ServiceProviderPerformanceDashboard } from "@/components/service-provider-performance/service-provider-performance-dashboard";

export const metadata = {
  title: "أداء مزودي الخدمات وSLA | AVOS",
  description:
    "مركز AVOS الذكي لمراقبة أداء مزودي الخدمات والالتزام باتفاقيات مستوى الخدمة.",
};

export default function ServiceProviderPerformancePage() {
  return <ServiceProviderPerformanceDashboard />;
}
