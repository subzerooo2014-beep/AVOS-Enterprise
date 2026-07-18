const services = [
  {
    title: "فحص AVOS الشامل",
    description:
      "فحص هيكل، محرك، إلكترونيات، وحوادث مع تقرير ذكي.",
    price: "من 499 د.إ",
  },
  {
    title: "تمويل ذكي",
    description:
      "مقارنة عروض البنوك وحساب القسط المناسب فورًا.",
    price: "موافقة مبدئية",
  },
  {
    title: "تأمين ومقارنة",
    description:
      "عروض تأمين شاملة من مزودين معتمدين.",
    price: "وفر حتى 18%",
  },
  {
    title: "ضمان ممتد",
    description:
      "حماية المحرك والقير والأنظمة الأساسية.",
    price: "حتى 3 سنوات",
  },
];

export function VehicleServiceBundle() {
  return (
    <section className="vehicle-service-bundle">
      <div>
        <span>خدمات مرتبطة بالسيارة</span>
        <h2>
          أكمل عملية الشراء داخل AVOS
        </h2>
        <p>
          اختر الفحص، التمويل، التأمين والضمان
          دون مغادرة صفحة السيارة.
        </p>
      </div>

      <div className="vehicle-service-grid">
        {services.map((service) => (
          <article key={service.title}>
            <i>✓</i>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <strong>{service.price}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
