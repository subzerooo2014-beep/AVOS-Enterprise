"use client";

import { useMemo } from "react";
import {
  agendaItems,
  aiRecommendations,
  commandAlerts,
  commandKpis,
  organizationOverview,
} from "@/data/ai-command-center";
import { useAiCommandCenterStore } from "@/store/ai-command-center-store";
import styles from "./ai-command-center.module.css";

const priorityLabels = {
  medium: "متوسطة",
  high: "عالية",
  critical: "حرجة",
};

export function AiCommandCenter() {
  const state = useAiCommandCenterStore();

  const visibleRecommendations = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return aiRecommendations.filter((item) => {
      const text = [
        item.title,
        item.summary,
        item.owner,
        item.impact,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.priority === "all" || item.priority === state.priority)
      );
    });
  }, [state.priority, state.query]);

  const selectedRecommendation =
    aiRecommendations.find(
      (item) => item.id === state.selectedRecommendationId,
    ) ??
    visibleRecommendations[0] ??
    null;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS AI EXECUTIVE COMMAND CENTER</span>
          <h1>مركز القيادة الذكي</h1>
          <p>
            رؤية تنفيذية موحدة للقرارات والمؤشرات والتنبيهات والموافقات
            والأولويات اليومية عبر جميع مؤسسات AVOS.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>مؤشر القيادة</small>
          <strong>94/100</strong>
          <span>الوضع العام مستقر</span>
        </div>
      </section>

      <section className={styles.kpiGrid}>
        {commandKpis.map((kpi) => (
          <article key={kpi.id}>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <small className={kpi.trend >= 0 ? styles.up : styles.down}>
              {kpi.trend >= 0 ? "+" : ""}
              {kpi.trend}%
            </small>
          </article>
        ))}
      </section>

      <section className={styles.quickActions}>
        <button type="button">تشغيل تحليل شامل</button>
        <button type="button">فتح الموافقات</button>
        <button type="button">إنشاء قرار تنفيذي</button>
        <button type="button">مراجعة المخاطر</button>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في التوصيات والقرارات"
        />
        <select
          value={state.priority}
          onChange={(event) => state.setPriority(event.target.value)}
        >
          <option value="all">كل الأولويات</option>
          <option value="medium">متوسطة</option>
          <option value="high">عالية</option>
          <option value="critical">حرجة</option>
        </select>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.recommendationsPanel}>
          <div className={styles.heading}>
            <div>
              <span>AI RECOMMENDATION FEED</span>
              <h2>التوصيات التنفيذية</h2>
            </div>
            <strong>{visibleRecommendations.length}</strong>
          </div>

          <div className={styles.recommendationGrid}>
            {visibleRecommendations.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => state.selectRecommendation(item.id)}
                className={`${styles.recommendationCard} ${
                  selectedRecommendation?.id === item.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{item.id}</span>
                  <span className={styles[item.priority]}>
                    {priorityLabels[item.priority]}
                  </span>
                </div>
                <small>{item.owner}</small>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <footer>
                  <span>الثقة {item.confidence}%</span>
                  <strong>{item.status}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.decisionPanel}>
          {selectedRecommendation && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>EXECUTIVE DECISION</span>
                  <h2>{selectedRecommendation.id}</h2>
                </div>
              </div>

              <div className={styles.decisionHero}>
                <span>{selectedRecommendation.owner}</span>
                <h3>{selectedRecommendation.title}</h3>
                <p>{selectedRecommendation.summary}</p>
              </div>

              <div className={styles.impactBox}>
                <span>الأثر المتوقع</span>
                <strong>{selectedRecommendation.impact}</strong>
              </div>

              <div className={styles.confidenceBox}>
                <span>درجة الثقة</span>
                <strong>{selectedRecommendation.confidence}%</strong>
              </div>

              <div className={styles.actions}>
                <button type="button">اعتماد وتنفيذ</button>
                <button type="button">إرسال للمراجعة</button>
                <button type="button">رفض</button>
              </div>
            </>
          )}
        </aside>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.panel}>
          <div className={styles.heading}>
            <div>
              <span>CRITICAL ALERTS</span>
              <h2>التنبيهات الحرجة</h2>
            </div>
          </div>
          {commandAlerts.map((alert) => (
            <div key={alert.id} className={styles.alertRow}>
              <span className={styles[alert.severity]}>{alert.severity}</span>
              <div>
                <strong>{alert.title}</strong>
                <small>
                  {alert.source} · {alert.createdAt}
                </small>
              </div>
            </div>
          ))}
        </article>

        <article className={styles.panel}>
          <div className={styles.heading}>
            <div>
              <span>SMART AGENDA</span>
              <h2>الأجندة الذكية</h2>
            </div>
          </div>
          {agendaItems.map((item) => (
            <div key={item.id} className={styles.agendaRow}>
              <strong>{item.time}</strong>
              <div>
                <span>{item.title}</span>
                <small>{item.owner}</small>
              </div>
            </div>
          ))}
        </article>

        <article className={styles.panel}>
          <div className={styles.heading}>
            <div>
              <span>MULTI-ORGANIZATION OVERVIEW</span>
              <h2>نظرة المؤسسات</h2>
            </div>
          </div>
          {organizationOverview.map((organization) => (
            <div key={organization.id} className={styles.organizationRow}>
              <div>
                <strong>{organization.name}</strong>
                <small>{organization.active} طلباً نشطاً</small>
              </div>
              <span>{organization.health}%</span>
              <b>{organization.revenue} AED</b>
            </div>
          ))}
        </article>
      </section>

      <button
        type="button"
        className={styles.chatButton}
        onClick={state.toggleChat}
      >
        عزم AI
      </button>

      {state.chatOpen && (
        <aside className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <div>
              <strong>عزم — المساعد التنفيذي</strong>
              <small>متصل ببيانات AVOS</small>
            </div>
            <button type="button" onClick={state.toggleChat}>
              ×
            </button>
          </div>
          <div className={styles.chatBody}>
            <p>
              صباح الخير. أهم أولوية الآن هي حماية SLA لخدمات المركبات
              الكهربائية في دبي والشارقة.
            </p>
          </div>
          <div className={styles.chatInput}>
            <input placeholder="اسأل عزم عن أداء المنصة..." />
            <button type="button">إرسال</button>
          </div>
        </aside>
      )}
    </main>
  );
}
