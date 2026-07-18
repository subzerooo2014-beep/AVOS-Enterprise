"use client";

import { useMemo } from "react";
import {
  pricingModeLabels,
  revenueMarginRecords,
  revenueStatusLabels,
} from "@/data/revenue-margin-intelligence";
import { useRevenueMarginIntelligenceStore } from "@/store/revenue-margin-intelligence-store";
import styles from "./revenue-margin-intelligence.module.css";

function money(value: number) {
  return new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueMarginIntelligenceCenter() {
  const state = useRevenueMarginIntelligenceStore();

  const visibleRecords = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return revenueMarginRecords.filter((item) => {
      const text = [
        item.service,
        item.region,
        item.owner,
        item.recommendation,
        ...item.actions,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.status === "all" || item.status === state.status) &&
        (state.pricingMode === "all" || item.pricingMode === state.pricingMode) &&
        (!state.opportunityOnly || item.opportunityValue > 20000)
      );
    });
  }, [state.opportunityOnly, state.pricingMode, state.query, state.status]);

  const selectedRecord =
    revenueMarginRecords.find((item) => item.id === state.selectedRecordId) ??
    visibleRecords[0] ??
    null;

  const totalRevenue = revenueMarginRecords.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  const totalOpportunity = revenueMarginRecords.reduce(
    (sum, item) => sum + item.opportunityValue,
    0,
  );

  const averageMargin = Math.round(
    revenueMarginRecords.reduce((sum, item) => sum + item.grossMargin, 0) /
      revenueMarginRecords.length,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS REVENUE & MARGIN INTELLIGENCE</span>
          <h1>مركز الإيرادات والهامش الذكي</h1>
          <p>
            تحليل موحد للإيرادات والهوامش والتسعير والتحويل والفرص
            التجارية عبر خدمات AVOS.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>إجمالي الإيرادات</small>
          <strong>{money(totalRevenue)}</strong>
          <span>{money(totalOpportunity)} فرص محتملة</span>
        </div>
      </section>

      <section className={styles.kpis}>
        <article>
          <span>متوسط الهامش</span>
          <strong>{averageMargin}%</strong>
          <small>جميع الخدمات</small>
        </article>
        <article>
          <span>الفرص النشطة</span>
          <strong>{revenueMarginRecords.filter((i) => i.status === "opportunity").length}</strong>
          <small>قابلة للتنفيذ</small>
        </article>
        <article>
          <span>تسعير ديناميكي</span>
          <strong>{revenueMarginRecords.filter((i) => i.pricingMode === "dynamic").length}</strong>
          <small>خدمات نشطة</small>
        </article>
        <article>
          <span>حالات حرجة</span>
          <strong>{revenueMarginRecords.filter((i) => i.status === "critical").length}</strong>
          <small>تحتاج تدخلاً</small>
        </article>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في الخدمات والمناطق والتوصيات"
        />
        <select
          value={state.status}
          onChange={(event) => state.setStatus(event.target.value)}
        >
          <option value="all">كل الحالات</option>
          {Object.entries(revenueStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={state.pricingMode}
          onChange={(event) => state.setPricingMode(event.target.value)}
        >
          <option value="all">كل أنماط التسعير</option>
          {Object.entries(pricingModeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          type="button"
          className={state.opportunityOnly ? styles.active : ""}
          onClick={state.toggleOpportunityOnly}
        >
          فرص 20K+
        </button>
        <button type="button" onClick={state.reset}>إعادة الضبط</button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>REVENUE MARGIN MATRIX</span>
              <h2>الخدمات والإيرادات</h2>
            </div>
            <strong>{visibleRecords.length}</strong>
          </div>

          <div className={styles.recordGrid}>
            {visibleRecords.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => state.selectRecord(item.id)}
                className={`${styles.recordCard} ${
                  selectedRecord?.id === item.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{item.id}</span>
                  <span className={styles[item.status]}>
                    {revenueStatusLabels[item.status]}
                  </span>
                </div>
                <small>{item.region}</small>
                <h3>{item.service}</h3>
                <p>{item.owner}</p>
                <div className={styles.metrics}>
                  <div>
                    <span>الإيراد</span>
                    <strong>{money(item.revenue)}</strong>
                  </div>
                  <div>
                    <span>الهامش</span>
                    <strong>{item.grossMargin}%</strong>
                  </div>
                  <div>
                    <span>التحويل</span>
                    <strong>{item.conversionRate}%</strong>
                  </div>
                </div>
                <div className={styles.progress}>
                  <div>
                    <span>الهامش مقابل الهدف</span>
                    <strong>
                      {item.grossMargin}% / {item.targetMargin}%
                    </strong>
                  </div>
                  <i>
                    <b style={{ width: `${Math.min(100, (item.grossMargin / item.targetMargin) * 100)}%` }} />
                  </i>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{pricingModeLabels[item.pricingMode]}</span>
                  <strong>{money(item.opportunityValue)}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedRecord && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>REVENUE CONTROL PROFILE</span>
                  <h2>{selectedRecord.id}</h2>
                </div>
                <span className={styles.badge}>
                  {revenueStatusLabels[selectedRecord.status]}
                </span>
              </div>

              <div className={styles.recordHero}>
                <span>{selectedRecord.region}</span>
                <h3>{selectedRecord.service}</h3>
                <p>{selectedRecord.owner}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>الإيراد</dt>
                  <dd>{money(selectedRecord.revenue)}</dd>
                </div>
                <div>
                  <dt>الهامش الحالي</dt>
                  <dd>{selectedRecord.grossMargin}%</dd>
                </div>
                <div>
                  <dt>الهامش المستهدف</dt>
                  <dd>{selectedRecord.targetMargin}%</dd>
                </div>
                <div>
                  <dt>مؤشر الطلب</dt>
                  <dd>{selectedRecord.demandIndex}</dd>
                </div>
              </dl>

              <div className={styles.opportunityBox}>
                <span>قيمة الفرصة</span>
                <strong>{money(selectedRecord.opportunityValue)}</strong>
              </div>

              <div className={styles.actionsBox}>
                <span>الإجراءات المقترحة</span>
                {selectedRecord.actions.map((action) => (
                  <strong key={action}>{action}</strong>
                ))}
              </div>

              <div className={styles.aiBox}>
                <span>AVOS REVENUE INTELLIGENCE</span>
                <strong>{selectedRecord.recommendation}</strong>
              </div>

              <div className={styles.actions}>
                <button type="button">تطبيق توصية التسعير</button>
                <button type="button">تشغيل محاكاة الهامش</button>
                <button type="button">إنشاء خطة إيراد</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
