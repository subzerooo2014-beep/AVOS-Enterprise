import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';

export default function TrustPage() {
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          eyebrow="Trust & Compliance"
          title="الثقة ليست ميزة إضافية"
          description="تمثل الثقة والامتثال والسلطة البشرية جزءًا من أساس AVOS."
        />
        <div className="content-grid">
          <Card>
            <h3>Human Final Authority</h3>
            <p>
              القرارات الاستراتيجية والحساسة لا تصبح نهائية دون
              موافقة بشرية صريحة.
            </p>
          </Card>
          <Card>
            <h3>Global Compliance Ready</h3>
            <p>
              بنية قابلة للتكيف مع الأنظمة القضائية والخصوصية
              والتدقيق عبر الأسواق.
            </p>
          </Card>
          <Card>
            <h3>Auditability</h3>
            <p>
              كل قرار وتشغيل وتغيير قابل للتتبع والمراجعة ضمن
              سجل مؤسسي موحد.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}