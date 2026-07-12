import {
  CarIcon,
  ChartIcon,
  ServiceIcon,
  ShieldIcon,
  SparklesIcon,
} from "./icons";

const featureCards = [
  {
    icon: CarIcon,
    title: "سوق سيارات ذكي",
    description:
      "إعلانات موثقة، مقارنة فورية، تقييم سعر السوق، وتوصيات تناسب احتياجك.",
    metric: "25,000+",
    metricLabel: "سيارة متاحة",
  },
  {
    icon: ServiceIcon,
    title: "خدمات متكاملة",
    description:
      "صيانة، تأمين، تمويل، فحص، نقل وقطع غيار من مزودين معتمدين.",
    metric: "1,200+",
    metricLabel: "مزود خدمة",
  },
  {
    icon: SparklesIcon,
    title: "مساعد AVOS",
    description:
      "مستشار ذكي يتابع رحلتك، يحلل الخيارات، وينفذ المهام نيابة عنك.",
    metric: "24/7",
    metricLabel: "ذكاء متواصل",
  },
  {
    icon: ShieldIcon,
    title: "ثقة وحماية",
    description:
      "تقييم مخاطر، فحص احتيال، توثيق معلومات، وسجل شفاف لكل عملية.",
    metric: "99.8%",
    metricLabel: "دقة التحقق",
  },
];

const intelligenceItems = [
  "تحليل السعر الحقيقي ومقارنته بالسوق",
  "اكتشاف الإعلانات المكررة أو المشبوهة",
  "توقع تكلفة الملكية والصيانة",
  "اقتراح أفضل وقت للشراء أو البيع",
  "توليد إعلان احترافي وتسويقه تلقائيًا",
  "مراقبة السوق وإرسال الفرص المناسبة",
];

export function FeatureSections() {
  return (
    <>
      <section className="section" id="market">
        <div className="shell">
          <div className="section-heading">
            <span className="section-kicker">منظومة متكاملة</span>
            <h2>أكثر من مجرد موقع لبيع السيارات</h2>
            <p>
              AVOS يجمع السوق والخدمات والأعمال والذكاء الاصطناعي
              داخل تجربة واحدة سريعة وآمنة.
            </p>
          </div>

          <div className="feature-grid">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-metric">
                    <strong>{feature.metric}</strong>
                    <span>{feature.metricLabel}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section intelligence-section" id="intelligence">
        <div className="shell intelligence-grid">
          <div className="intelligence-panel">
            <div className="panel-orbit orbit-one" />
            <div className="panel-orbit orbit-two" />
            <div className="brain-core">
              <SparklesIcon size={36} />
            </div>

            <div className="intelligence-stat stat-one">
              <span>تحليلات اليوم</span>
              <strong>148,392</strong>
            </div>

            <div className="intelligence-stat stat-two">
              <span>فرص مكتشفة</span>
              <strong>2,148</strong>
            </div>

            <div className="intelligence-stat stat-three">
              <span>قرارات ناجحة</span>
              <strong>97.4%</strong>
            </div>
          </div>

          <div className="intelligence-copy">
            <div className="eyebrow">
              <SparklesIcon size={17} />
              AVOS Enterprise Intelligence
            </div>
            <h2>ذكاء لا ينتظر أوامرك فقط، بل يفكر معك.</h2>
            <p>
              محركات AVOS الخلفية تحلل البيانات، تنسق العمليات،
              تراقب الجودة، وتبني معرفة مستمرة تساعد العملاء
              والتجار ومزودي الخدمات على اتخاذ قرارات أفضل.
            </p>

            <div className="intelligence-list">
              {intelligenceItems.map((item) => (
                <div key={item}>
                  <span>✓</span>
                  {item}
                </div>
              ))}
            </div>

            <button className="button button-primary button-large">
              جرّب المساعد الذكي
            </button>
          </div>
        </div>
      </section>

      <section className="section business-section" id="business">
        <div className="shell business-card">
          <div>
            <span className="section-kicker">AVOS للأعمال</span>
            <h2>شغّل معرضك أو شركتك بذكاء أكبر.</h2>
            <p>
              إدارة مخزون، عملاء، مبيعات، حملات، نشر تلقائي،
              تقارير مالية، وفرق عمل من لوحة تشغيل موحدة.
            </p>
          </div>

          <div className="business-metrics">
            <div>
              <ChartIcon size={24} />
              <strong>+34%</strong>
              <span>تحسن سرعة المبيعات</span>
            </div>
            <div>
              <SparklesIcon size={24} />
              <strong>-62%</strong>
              <span>وقت إدارة الإعلانات</span>
            </div>
            <div>
              <ShieldIcon size={24} />
              <strong>100%</strong>
              <span>توثيق العمليات</span>
            </div>
          </div>

          <button className="button button-light button-large">
            افتح حساب أعمال
          </button>
        </div>
      </section>
    </>
  );
}
