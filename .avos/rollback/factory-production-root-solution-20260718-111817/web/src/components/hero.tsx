import {
  ArrowIcon,
  CarIcon,
  SearchIcon,
  SparklesIcon,
} from "./icons";

export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="shell hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <SparklesIcon size={17} />
            منظومة السيارات الذكية في الإمارات
          </div>

          <h1>
            كل ما يتعلق بسيارتك
            <span> في منصة واحدة ذكية.</span>
          </h1>

          <p className="hero-description">
            ابحث، قارن، اشترِ، بِع، احجز الخدمات، وأدر أعمالك
            بمساعدة ذكاء AVOS الذي يفهم السوق ويتطور باستمرار.
          </p>

          <div className="hero-actions">
            <button className="button button-primary button-large">
              استكشف السيارات
              <ArrowIcon size={18} />
            </button>
            <button className="button button-secondary button-large">
              اعرض سيارتك
            </button>
          </div>

          <div className="trust-row">
            <div>
              <strong>+25K</strong>
              <span>إعلان موثوق</span>
            </div>
            <div>
              <strong>+1.2K</strong>
              <span>مزود خدمة</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>مساعد ذكي</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-card">
            <div className="dashboard-top">
              <div>
                <span className="micro-label">AVOS Intelligence</span>
                <h3>ابحث عن سيارتك المثالية</h3>
              </div>
              <span className="ai-badge">
                <SparklesIcon size={16} />
                AI
              </span>
            </div>

            <div className="smart-search">
              <SearchIcon size={20} />
              <span>
                أبحث عن SUV عائلية، اقتصادية، أقل من 180 ألف درهم
              </span>
              <button type="button">بحث ذكي</button>
            </div>

            <div className="insight-card">
              <div className="insight-icon">
                <CarIcon size={29} />
              </div>
              <div>
                <span>أفضل تطابق لك</span>
                <strong>Range Rover Sport 2025</strong>
                <small>تطابق 96% مع احتياجاتك</small>
              </div>
              <div className="match-score">96%</div>
            </div>

            <div className="mini-grid">
              <div className="mini-card">
                <span>سعر السوق</span>
                <strong>365,000 د.إ</strong>
                <small className="positive">أقل 4.8% من المتوسط</small>
              </div>
              <div className="mini-card">
                <span>تقييم AVOS</span>
                <strong>9.4 / 10</strong>
                <small>فرصة ممتازة</small>
              </div>
            </div>

            <div className="activity-strip">
              <div className="activity-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div>
                <strong>السوق نشط الآن</strong>
                <span>تم تحليل 4,820 إعلانًا خلال آخر ساعة</span>
              </div>
            </div>
          </div>

          <div className="floating-card floating-card-top">
            <span className="floating-symbol">✓</span>
            <div>
              <strong>فحص ذكي مكتمل</strong>
              <small>لا توجد مخاطر جوهرية</small>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <span className="floating-symbol spark">
              <SparklesIcon size={16} />
            </span>
            <div>
              <strong>اقتراح من AVOS</strong>
              <small>السعر قابل للتفاوض بنسبة 3%</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
