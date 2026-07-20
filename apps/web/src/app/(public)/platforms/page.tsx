import { platformCards } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';

export default function PlatformsPage() {
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          eyebrow="Platforms"
          title="منصات AVOS الأساسية"
          description="منتجات وقدرات تعمل فوق نواة موحدة وقابلة للتوسع."
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
  );
}