import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  GlobalSearchBox,
} from "@/components/global-search-box";
import { getApiStatus } from "@/lib/api";

export default async function SearchPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell search-page">
        <GlobalSearchBox />
      </div>

      <Footer />
    </main>
  );
}
