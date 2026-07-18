import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProviderWorkspaceDashboard } from "@/components/provider-workspace/provider-workspace-dashboard";
import { getApiStatus } from "@/lib/api";

export default async function ProviderWorkspacePage() {
  const apiStatus = await getApiStatus();
  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell provider-workspace-page"><ProviderWorkspaceDashboard /></div>
      <Footer />
    </main>
  );
}
