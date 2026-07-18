"use client";

import Link from "next/link";
import { commandAlerts, commandModules } from "@/data/enterprise-command-center";
import styles from "./enterprise-command-center.module.css";

const statusLabels = {
  healthy: "سليم",
  watch: "مراقبة",
  critical: "حرج",
};

const severityLabels = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع",
  critical: "حرج",
};

export function EnterpriseCommandCenter() {
  const healthScore = Math.round(
    commandModules.reduce((sum, item) => sum + item.score, 0) /
      commandModules.length,
  );

  const criticalModules = commandModules.filter(
    (item) => item.status === "critical",
  ).length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS WEB PLATFORM V3</span>
          <h1>مركز القيادة المؤسسي الموحد</h1>
          <p>
            رؤية واحدة لجميع أنظمة AVOS، مع مراقبة الأداء والمخاطر
            والإيرادات والعمليات والقرارات الذكية لحظياً.
          </p>
        </div>
        <div className={styles.health}>
          <small>مؤشر صحة المنصة</small>
          <strong>{healthScore}/100</strong>
          <span>{criticalModules} وحدات تحتاج تدخلاً</span>
        </div>
      </section>

      <section className={styles.kpis}>
        <article>
          <span>الطلبات النشطة</span>
          <strong>184</strong>
          <small>+12% عن الساعة السابقة</small>
        </article>
        <article>
          <span>إيراد اليوم</span>
          <strong>219K AED</strong>
          <small>الهدف اليومي 250K</small>
        </article>
        <article>
          <span>التزام SLA</span>
          <strong>89%</strong>
          <small>4 حالات قريبة من التجاوز</small>
        </article>
        <article>
          <span>قرارات AVOS اليوم</span>
          <strong>1,284</strong>
          <small>73% منفذة تلقائياً</small>
        </article>
      </section>

      <section className={styles.workspace}>
        <div className={styles.modulesPanel}>
          <div className={styles.heading}>
            <div>
              <span>ENTERPRISE SYSTEM MAP</span>
              <h2>أنظمة AVOS الرئيسية</h2>
            </div>
            <strong>{commandModules.length} وحدات</strong>
          </div>

          <div className={styles.moduleGrid}>
            {commandModules.map((module) => (
              <Link
                key={module.id}
                href={module.route}
                className={styles.moduleCard}
              >
                <div className={styles.cardTop}>
                  <span>{module.id}</span>
                  <span className={styles[module.status]}>
                    {statusLabels[module.status]}
                  </span>
                </div>
                <h3>{module.name}</h3>
                <p>{module.description}</p>
                <div className={styles.metric}>
                  <span>{module.metric}</span>
                  <strong>{module.value}</strong>
                </div>
                <div className={styles.score}>
                  <div style={{ width: `${module.score}%` }} />
                </div>
                <small>مؤشر الأداء {module.score}%</small>
              </Link>
            ))}
          </div>
        </div>

        <aside className={styles.aiPanel}>
          <span>AVOS ENTERPRISE BRAIN</span>
          <h2>القرار التنفيذي الآن</h2>
          <strong>
            انقل 3 فنيين مؤهلين للمركبات الكهربائية من أبوظبي إلى
            دبي والشارقة خلال فترة الذروة.
          </strong>
          <p>
            سيخفض القرار خطر تجاوز SLA المتوقع بنسبة 37% ويحمي
            ما يقارب 68 ألف درهم من قيمة العملاء.
          </p>
          <div>
            <span>الثقة</span>
            <b>94%</b>
          </div>
          <button type="button">اعتماد القرار</button>
        </aside>
      </section>

      <section className={styles.alerts}>
        <div className={styles.heading}>
          <div>
            <span>LIVE ENTERPRISE ALERTS</span>
            <h2>التنبيهات ذات الأولوية</h2>
          </div>
        </div>
        <div className={styles.alertGrid}>
          {commandAlerts.map((alert) => (
            <article key={alert.id}>
              <div className={styles.cardTop}>
                <span>{alert.id}</span>
                <span className={styles[alert.severity]}>
                  {severityLabels[alert.severity]}
                </span>
              </div>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
              <small>{alert.owner}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
