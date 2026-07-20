import { marketplacePreview } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MarketplacePage() {
  return (
    <main className="marketplace-page">
      <section className="marketplace-hero">
        <div className="container">
          <span className="eyebrow">AVOS Mobility Marketplace</span>
          <h1>اكتشف المركبة بثقة</h1>
          <p>
            بحث ذكي، Trust Score، Demand Heat، وعملية صفقة واضحة.
          </p>
          <div className="search-bar">
            <input placeholder="ابحث عن مركبة، علامة، أو فئة" />
            <Button>بحث</Button>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container market-grid">
          {marketplacePreview.map((item) => (
            <Card key={item.title} className="vehicle-card">
              <div className="vehicle-image">
                <span>AVOS Verified</span>
              </div>
              <h2>{item.title}</h2>
              <strong>{item.price}</strong>
              <div className="vehicle-meta">
                <span>Trust Score: {item.trust}</span>
                <span>Demand Heat: {item.demand}</span>
              </div>
              <Button variant="secondary">عرض التفاصيل</Button>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}