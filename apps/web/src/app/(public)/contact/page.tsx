import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';

export default function ContactPage() {
  return (
    <section className="page-section">
      <div className="container narrow-container">
        <SectionHeading
          eyebrow="Contact"
          title="تواصل مع AVOS"
          description="نموذج تأسيسي جاهز للربط لاحقًا بخدمة الرسائل وإدارة العملاء."
        />
        <form className="contact-form">
          <label>
            الاسم
            <input name="name" placeholder="الاسم الكامل" />
          </label>
          <label>
            البريد الإلكتروني
            <input
              name="email"
              placeholder="name@example.com"
              type="email"
            />
          </label>
          <label>
            الرسالة
            <textarea
              name="message"
              placeholder="كيف يمكننا مساعدتك؟"
              rows={6}
            />
          </label>
          <Button type="submit">إرسال الطلب</Button>
        </form>
      </div>
    </section>
  );
}