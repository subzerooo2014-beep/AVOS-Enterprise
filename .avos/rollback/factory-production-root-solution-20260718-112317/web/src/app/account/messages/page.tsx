import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  AccountNavigation,
} from "@/components/account-navigation";
import {
  BuyerMessageCenter,
} from "@/components/buyer-message-center";
import { getApiStatus } from "@/lib/api";

export default async function MessagesPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell account-page">
        <AccountNavigation />
        <div className="account-section-heading">
          <span>AVOS Messaging</span>
          <h1>المحادثات</h1>
          <p>
            تواصل مع البائعين داخل بيئة
            موثقة وآمنة.
          </p>
        </div>
        <BuyerMessageCenter />
      </div>
      <Footer />
    </main>
  );
}
