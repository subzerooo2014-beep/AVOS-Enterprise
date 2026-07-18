import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  SellerNavigation,
} from "@/components/seller-navigation";
import { vehicles } from "@/data/vehicles";
import { sellerLeads } from "@/data/leads";
import { getApiStatus } from "@/lib/api";

export default async function SellerDashboardPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell seller-page">
        <SellerNavigation />

        <section className="seller-hero">
          <div>
            <span>AVOS Seller Intelligence</span>
            <h1>شغّل مبيعاتك من مكان واحد.</h1>
            <p>
              المخزون، العملاء، العروض، الحملات،
              والتوصيات الذكية في لوحة واحدة.
            </p>
          </div>

          <Link
            href="/seller/listings/new"
            className="button button-primary button-large"
          >
            أضف سيارة جديدة
          </Link>
        </section>

        <section className="seller-kpi-grid">
          <article>
            <span>المشاهدات</span>
            <strong>8,420</strong>
            <small>+18% هذا الأسبوع</small>
          </article>
          <article>
            <span>العملاء المحتملون</span>
            <strong>{sellerLeads.length}</strong>
            <small>3 فرص عالية الأولوية</small>
          </article>
          <article>
            <span>معدل التحويل</span>
            <strong>14.8%</strong>
            <small>أعلى من متوسط السوق</small>
          </article>
          <article>
            <span>قيمة الصفقات</span>
            <strong>1.84M د.إ</strong>
            <small>فرص مفتوحة</small>
          </article>
        </section>

        <section className="seller-dashboard-grid">
          <div className="seller-panel-card">
            <div className="seller-card-heading">
              <div>
                <span>المخزون</span>
                <h2>أفضل الإعلانات أداءً</h2>
              </div>
              <Link href="/seller/inventory">
                عرض الكل
              </Link>
            </div>

            <div className="seller-list">
              {vehicles.slice(0, 4).map((vehicle, index) => (
                <article key={vehicle.id}>
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                  />
                  <div>
                    <strong>{vehicle.title}</strong>
                    <span>
                      {820 + index * 317} مشاهدة
                    </span>
                  </div>
                  <b>{88 + index * 2}%</b>
                </article>
              ))}
            </div>
          </div>

          <div className="seller-panel-card">
            <div className="seller-card-heading">
              <div>
                <span>العملاء</span>
                <h2>أعلى الفرص أولوية</h2>
              </div>
              <Link href="/seller/leads">
                إدارة العملاء
              </Link>
            </div>

            <div className="seller-list">
              {sellerLeads
                .slice()
                .sort((a, b) => b.score - a.score)
                .slice(0, 4)
                .map((lead) => (
                  <article key={lead.id}>
                    <div className="lead-avatar">
                      {lead.customerName.charAt(0)}
                    </div>
                    <div>
                      <strong>{lead.customerName}</strong>
                      <span>{lead.vehicleTitle}</span>
                    </div>
                    <b>{lead.score}</b>
                  </article>
                ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
