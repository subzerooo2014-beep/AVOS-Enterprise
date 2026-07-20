import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { MetricCard } from '@/components/ui/metric-card';
import { platformCards, marketplacePreview } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              Premium • AI First • Global • Trusted
            </span>
            <h1>
              نظام التشغيل الذكي
              <span> لمستقبل التنقل</span>
            </h1>
            <p>
              AVOS يوحّد السوق، الثقة، الذكاء الاصطناعي،
              الإنتاج البرمجي، والامتثال في منصة مؤسسية واحدة.
            </p>
            <div className="hero-actions">
              <Button href="/platforms">اكتشف المنصة</Button>
              <Button href="/control-center" variant="secondary">
                استعرض مركز التحكم
              </Button>
            </div>
            <div className="hero-proof">
              <span>Human Final Authority</span>
              <span>Global Compliance Ready</span>
              <span>Runtime Health 100</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orb orb-primary" />
            <div className="orb orb-secondary" />
            <div className="platform-core">
              <span>AVOS</span>
              <strong>Unified Intelligence</strong>
              <small>Foundation • Runtime • Experience</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="منصة واحدة"
            title="كل قدرات AVOS تعمل كمنظومة"
            description="من Foundation إلى Factory وFabrics وService Mesh، جميع الطبقات مترابطة وقابلة للمراقبة والتطوير."
            centered
          />
          <div className="platform-grid">
            {platformCards.map((platform) => (
              <Card key={platform.title}>
                <span className="card-badge">{platform.badge}</span>
                <h3>{platform.title}</h3>
                <p>{platform.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHeading
            eyebrow="Enterprise Runtime"
            title="صحة تشغيلية واضحة في الوقت الحقيقي"
            description="واجهة موحدة لمراقبة القدرات والاعتماديات والأحداث والشهادات."
          />
          <div className="metrics-grid">
            <MetricCard
              label="Runtime Health"
              value="100"
              detail="Operational"
            />
            <MetricCard
              label="Capabilities"
              value="5+"
              detail="Unified Registry"
            />
            <MetricCard
              label="Certification"
              value="100"
              detail="Production Ready"
            />
            <MetricCard
              label="Risk"
              value="0"
              detail="Controlled"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Marketplace Preview"
            title="تجربة شراء وبيع مبنية على الثقة"
            description="تصور أولي لواجهة السوق، العربون، Trust Score، وDemand Heat."
          />
          <div className="market-grid">
            {marketplacePreview.map((item) => (
              <Card key={item.title} className="vehicle-card">
                <div className="vehicle-image">
                  <span>AVOS Mobility</span>
                </div>
                <h3>{item.title}</h3>
                <strong>{item.price}</strong>
                <div className="vehicle-meta">
                  <span>Trust {item.trust}</span>
                  <span>الطلب: {item.demand}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container final-cta-inner">
          <div>
            <span className="eyebrow">Build the future</span>
            <h2>AVOS ليس موقعًا فقط، بل بوابة لمنظومة كاملة.</h2>
          </div>
          <Button href="/contact">ابدأ التواصل</Button>
        </div>
      </section>
    </>
  );
}