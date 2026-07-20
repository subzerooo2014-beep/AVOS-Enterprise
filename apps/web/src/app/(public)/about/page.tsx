import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          eyebrow="About AVOS"
          title="منظومة تشغيل ذكية للتنقل"
          description="تأسست رؤية AVOS لبناء منصة عالمية موحدة تجمع البنية التقنية، الذكاء، الثقة، والمنتجات الرقمية."
        />
        <div className="content-grid">
          <Card>
            <h3>الرؤية</h3>
            <p>
              بناء نظام تشغيل عالمي للتنقل يربط كل الأطراف
              والقرارات والقدرات ضمن تجربة واحدة موثوقة.
            </p>
          </Card>
          <Card>
            <h3>الرسالة</h3>
            <p>
              تحويل التعقيد التشغيلي والتقني إلى قدرات مترابطة
              يسهل استخدامها وتطويرها واعتمادها.
            </p>
          </Card>
          <Card>
            <h3>المبدأ</h3>
            <p>
              Foundation First، Capability First، والسلطة
              البشرية النهائية في القرارات الاستراتيجية.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}