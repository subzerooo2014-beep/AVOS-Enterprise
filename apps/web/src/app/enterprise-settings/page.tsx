import { EnterpriseSettingsCenter } from "@/components/enterprise-settings/enterprise-settings-center";

export const metadata = {
  title: "إعدادات AVOS المؤسسية",
  description: "إدارة تفضيلات المؤسسة والمستخدم والتنبيهات والواجهة.",
};

export default function EnterpriseSettingsPage() {
  return <EnterpriseSettingsCenter />;
}
