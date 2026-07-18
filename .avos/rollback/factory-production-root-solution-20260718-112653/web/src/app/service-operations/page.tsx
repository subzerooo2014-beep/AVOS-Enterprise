import { ServiceOperationsDashboard } from "@/components/service-operations/service-operations-dashboard";

export const metadata = {
  title: "مركز تشغيل الخدمات | AVOS",
  description:
    "مركز AVOS الموحد لإدارة عمليات الخدمات ومراقبة SLA والتصعيد الذكي.",
};

export default function ServiceOperationsPage() {
  return <ServiceOperationsDashboard />;
}
