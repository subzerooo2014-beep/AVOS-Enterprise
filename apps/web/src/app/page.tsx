import { FeatureSections } from "@/components/feature-sections";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { getApiStatus } from "@/lib/api";

export default async function HomePage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <Hero />
      <FeatureSections />
      <Footer />
    </main>
  );
}
