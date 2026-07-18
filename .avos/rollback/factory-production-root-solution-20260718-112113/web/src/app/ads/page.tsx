import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  smartAdCampaigns,
} from "@/data/ads";
import { getApiStatus } from "@/lib/api";

export default async function AdsPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell ads-page">
        <section className="ads-hero">
          <div>
            <span>AVOS Ads Intelligence</span>
            <h1>
              إعلانات تتعلم وتتحسن تلقائيًا.
            </h1>
            <p>
              استهداف ذكي، ميزانيات ديناميكية،
              وقياس مباشر للعملاء والصفقات.
            </p>
          </div>

          <button className="button button-primary button-large">
            أنشئ حملة ذكية
          </button>
        </section>

        <section className="ads-kpi-grid">
          <article>
            <span>الظهور</span>
            <strong>140.5K</strong>
            <small>+24% هذا الشهر</small>
          </article>
          <article>
            <span>النقرات</span>
            <strong>9,510</strong>
            <small>CTR 6.76%</small>
          </article>
          <article>
            <span>التحويلات</span>
            <strong>1,100</strong>
            <small>11.5% تحويل</small>
          </article>
          <article>
            <span>العائد</span>
            <strong>5.8x</strong>
            <small>ROAS</small>
          </article>
        </section>

        <section className="ads-campaign-list">
          <div className="ads-section-heading">
            <span>الحملات</span>
            <h2>الحملات النشطة</h2>
          </div>

          {smartAdCampaigns.map(
            (campaign) => (
              <article key={campaign.id}>
                <div>
                  <span>
                    {campaign.status}
                  </span>
                  <h3>
                    {campaign.title}
                  </h3>
                  <p>
                    {campaign.audience}
                  </p>
                </div>

                <div>
                  <span>الظهور</span>
                  <strong>
                    {
                      campaign.impressions
                    }
                  </strong>
                </div>

                <div>
                  <span>النقرات</span>
                  <strong>
                    {campaign.clicks}
                  </strong>
                </div>

                <div>
                  <span>التحويلات</span>
                  <strong>
                    {campaign.conversions}
                  </strong>
                </div>

                <div>
                  <span>الإنفاق</span>
                  <strong>
                    {campaign.spent} د.إ
                  </strong>
                </div>

                <b>
                  {campaign.aiOptimization
                    ? "AI مفعّل"
                    : "يدوي"}
                </b>
              </article>
            ),
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
