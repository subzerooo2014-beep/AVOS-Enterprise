"use client";

import styles from "./service-platform-accelerated.module.css";

export type AcceleratedModuleConfig = {
  megaPack: number;
  slug: string;
  title: string;
  englishTitle: string;
  description: string;
  kpis: Array<{ label: string; value: string; note: string }>;
  priorities: Array<{
    title: string;
    status: string;
    score: number;
    owner: string;
  }>;
  decisions: Array<{
    title: string;
    impact: string;
    recommendation: string;
  }>;
};

export function ServicePlatformAcceleratedDashboard({
  config,
}: {
  config: AcceleratedModuleConfig;
}) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS SERVICES PLATFORM V2 — MEGA PACK {config.megaPack}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className={styles.heroBadge}>
          <small>{config.englishTitle}</small>
          <strong>MP{config.megaPack}</strong>
          <span>جاهز للتشغيل</span>
        </div>
      </section>

      <section className={styles.kpis}>
        {config.kpis.map((kpi) => (
          <article key={kpi.label}>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <small>{kpi.note}</small>
          </article>
        ))}
      </section>

      <section className={styles.workspace}>
        <div className={styles.panel}>
          <div className={styles.heading}>
            <div>
              <span>OPERATIONAL PRIORITIES</span>
              <h2>الأولويات التشغيلية</h2>
            </div>
            <strong>{config.priorities.length} عناصر</strong>
          </div>

          <div className={styles.grid}>
            {config.priorities.map((item) => (
              <article key={item.title}>
                <div className={styles.cardTop}>
                  <span>{item.status}</span>
                  <b>{item.score}%</b>
                </div>
                <h3>{item.title}</h3>
                <p>المسؤول: {item.owner}</p>
                <div className={styles.progress}>
                  <span style={{ width: `${item.score}%` }} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <span>AVOS AI DECISION ENGINE</span>
          <h2>قرارات وتوصيات فورية</h2>

          <div className={styles.decisions}>
            {config.decisions.map((decision) => (
              <article key={decision.title}>
                <strong>{decision.title}</strong>
                <small>{decision.impact}</small>
                <p>{decision.recommendation}</p>
              </article>
            ))}
          </div>

          <button type="button">تشغيل خطة التنفيذ</button>
        </aside>
      </section>
    </main>
  );
}
