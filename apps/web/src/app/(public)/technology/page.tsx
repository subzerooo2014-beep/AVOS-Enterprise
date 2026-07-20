import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';

const layers = [
  'Foundation & Enterprise Kernel',
  'Capability Runtime & Service Mesh',
  'Knowledge & Intelligence Fabrics',
  'Factory & Production Certification',
  'Living Blueprint & Digital DNA',
  'Global Compliance Readiness',
];

export default function TechnologyPage() {
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          eyebrow="Technology"
          title="هندسة مبنية للنمو العالمي"
          description="طبقات مستقلة ومترابطة تمنع التكرار وتسمح بالتوسع الآمن."
        />
        <div className="content-grid">
          {layers.map((layer) => (
            <Card key={layer}>
              <h3>{layer}</h3>
              <p>
                مصمم للعمل ضمن معايير AVOS الموحدة، مع قابلية
                المراقبة والاختبار والتحديث المستمر.
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}