"use client";

import { useMemo } from "react";
import {
  capacityDemandRecords,
  capacityStatusLabels,
} from "@/data/capacity-demand-intelligence";
import { useCapacityDemandIntelligenceStore } from "@/store/capacity-demand-intelligence-store";
import styles from "./capacity-demand-intelligence.module.css";

function money(value: number) {
  return new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CapacityDemandIntelligenceCenter() {
  const state = useCapacityDemandIntelligenceStore();

  const regions = useMemo(
    () => Array.from(new Set(capacityDemandRecords.map((item) => item.region))),
    [],
  );

  const visibleRecords = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return capacityDemandRecords.filter((item) => {
      const text = [
        item.region,
        item.service,
        item.owner,
        item.recommendation,
        ...item.actions,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.status === "all" || item.status === state.status) &&
        (state.region === "all" || item.region === state.region) &&
        (!state.criticalOnly || item.utilization >= 90)
      );
    });
  }, [state.criticalOnly, state.query, state.region, state.status]);

  const selectedRecord =
    capacityDemandRecords.find(
      (item) => item.id === state.selectedRecordId,
    ) ??
    visibleRecords[0] ??
    null;

  const averageUtilization = Math.round(
    capacityDemandRecords.reduce((sum, item) => sum + item.utilization, 0) /
      capacityDemandRecords.length,
  );

  const totalRisk = capacityDemandRecords.reduce(
    (sum, item) => sum + item.revenueAtRisk,
    0,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS CAPACITY & DEMAND INTELLIGENCE</span>
          <h1>مركز السعة والطلب الذكي</h1>
          <p>
            رؤية لحظية للسعة والطلب والتنبؤ والاختناقات التشغيلية مع
            توصيات لإعادة التوزيع وحماية الإيرادات.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>متوسط الاستخدام</small>
          <strong>{averageUtilization}%</strong>
          <span>{money(totalRisk)} معرضة للخطر</span>
        </div>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في المناطق والخدمات والتوصيات"
        />
        <select
          value={state.region}
          onChange={(event) => state.setRegion(event.target.value)}
        >
          <option value="all">كل المناطق</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select
          value={state.status}
          onChange={(event) => state.setStatus(event.target.value)}
        >
          <option value="all">كل الحالات</option>
          {Object.entries(capacityStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={state.criticalOnly ? styles.active : ""}
          onClick={state.toggleCriticalOnly}
        >
          استخدام 90%+
        </button>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>CAPACITY DEMAND MATRIX</span>
              <h2>المناطق والخدمات</h2>
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
                    {capacityStatusLabels[item.status]}
                  </span>
                </div>
                <small>{item.region}</small>
                <h3>{item.service}</h3>
                <p>{item.owner}</p>
                <div className={styles.metrics}>
                  <div>
                    <span>الطلب</span>
                    <strong>{item.demandNow}</strong>
                  </div>
                  <div>
                    <span>السعة</span>
                    <strong>{item.capacityNow}</strong>
                  </div>
                  <div>
                    <span>التوقع</span>
                    <strong>{item.forecastDemand}</strong>
                  </div>
                </div>
                <div className={styles.progress}>
                  <div>
                    <span>الاستخدام</span>
                    <strong>{item.utilization}%</strong>
                  </div>
                  <i>
                    <b style={{ width: `${item.utilization}%` }} />
                  </i>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{item.peakWindow}</span>
                  <strong>{money(item.revenueAtRisk)}</strong>
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
                  <span>CAPACITY CONTROL PROFILE</span>
                  <h2>{selectedRecord.id}</h2>
                </div>
                <span className={styles.badge}>
                  {capacityStatusLabels[selectedRecord.status]}
                </span>
              </div>

              <div className={styles.recordHero}>
                <span>{selectedRecord.region}</span>
                <h3>{selectedRecord.service}</h3>
                <p>{selectedRecord.owner}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>الطلب الحالي</dt>
                  <dd>{selectedRecord.demandNow}</dd>
                </div>
                <div>
                  <dt>السعة الحالية</dt>
                  <dd>{selectedRecord.capacityNow}</dd>
                </div>
                <div>
                  <dt>الطلب المتوقع</dt>
                  <dd>{selectedRecord.forecastDemand}</dd>
                </div>
                <div>
                  <dt>الاستخدام</dt>
                  <dd>{selectedRecord.utilization}%</dd>
                </div>
              </dl>

              <div className={styles.riskBox}>
                <span>الإيراد المعرض للخطر</span>
                <strong>{money(selectedRecord.revenueAtRisk)}</strong>
              </div>

              <div className={styles.actionsBox}>
                <span>الإجراءات المقترحة</span>
                {selectedRecord.actions.map((action) => (
                  <strong key={action}>{action}</strong>
                ))}
              </div>

              <div className={styles.aiBox}>
                <span>AVOS CAPACITY INTELLIGENCE</span>
                <strong>{selectedRecord.recommendation}</strong>
              </div>

              <div className={styles.actions}>
                <button type="button">إعادة توزيع السعة</button>
                <button type="button">تشغيل المحاكاة</button>
                <button type="button">إنشاء تنبيه تشغيلي</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
