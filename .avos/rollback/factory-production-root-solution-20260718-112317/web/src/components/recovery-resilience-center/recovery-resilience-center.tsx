"use client";

import { useMemo } from "react";
import {
  resilienceScenarios,
  resilienceSeverityLabels,
  resilienceStatusLabels,
} from "@/data/recovery-resilience-center";
import { useRecoveryResilienceCenterStore } from "@/store/recovery-resilience-center-store";
import styles from "./recovery-resilience-center.module.css";

export function RecoveryResilienceCenter() {
  const state = useRecoveryResilienceCenterStore();

  const visibleScenarios = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return resilienceScenarios.filter((scenario) => {
      const text = [
        scenario.title,
        scenario.service,
        scenario.owner,
        scenario.impact,
        scenario.nextAction,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.status === "all" || scenario.status === state.status) &&
        (state.severity === "all" || scenario.severity === state.severity) &&
        (!state.attentionOnly || scenario.readiness < 90)
      );
    });
  }, [state.attentionOnly, state.query, state.severity, state.status]);

  const selectedScenario =
    resilienceScenarios.find(
      (scenario) => scenario.id === state.selectedScenarioId,
    ) ??
    visibleScenarios[0] ??
    null;

  const averageReadiness = Math.round(
    resilienceScenarios.reduce(
      (sum, scenario) => sum + scenario.readiness,
      0,
    ) / resilienceScenarios.length,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS ENTERPRISE RECOVERY & RESILIENCE OS</span>
          <h1>مركز التعافي والمرونة</h1>
          <p>
            مراقبة جاهزية التعافي واستمرارية الأعمال واختبارات الفشل
            وخطط العودة للخدمة.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>جاهزية التعافي</small>
          <strong>{averageReadiness}%</strong>
          <span>{resilienceScenarios.length} سيناريوهات</span>
        </div>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في السيناريوهات والخدمات والمالكين"
        />
        <select
          value={state.status}
          onChange={(event) => state.setStatus(event.target.value)}
        >
          <option value="all">كل الحالات</option>
          {Object.entries(resilienceStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={state.severity}
          onChange={(event) => state.setSeverity(event.target.value)}
        >
          <option value="all">كل الخطورة</option>
          {Object.entries(resilienceSeverityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={state.attentionOnly ? styles.active : ""}
          onClick={state.toggleAttentionOnly}
        >
          تحتاج انتباهاً
        </button>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>RESILIENCE SCENARIO LIBRARY</span>
              <h2>سيناريوهات التعافي</h2>
            </div>
            <strong>{visibleScenarios.length}</strong>
          </div>

          <div className={styles.scenarioGrid}>
            {visibleScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => state.selectScenario(scenario.id)}
                className={`${styles.scenarioCard} ${
                  selectedScenario?.id === scenario.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{scenario.id}</span>
                  <span className={styles[scenario.severity]}>
                    {resilienceSeverityLabels[scenario.severity]}
                  </span>
                </div>
                <small>{scenario.service}</small>
                <h3>{scenario.title}</h3>
                <p>{scenario.impact}</p>
                <div className={styles.progress}>
                  <div>
                    <span>الجاهزية</span>
                    <strong>{scenario.readiness}%</strong>
                  </div>
                  <i>
                    <b style={{ width: `${scenario.readiness}%` }} />
                  </i>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{resilienceStatusLabels[scenario.status]}</span>
                  <strong>{scenario.lastTest}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedScenario && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>RECOVERY CONTROL PROFILE</span>
                  <h2>{selectedScenario.id}</h2>
                </div>
                <span className={styles.badge}>
                  {resilienceStatusLabels[selectedScenario.status]}
                </span>
              </div>

              <div className={styles.scenarioHero}>
                <span>{selectedScenario.service}</span>
                <h3>{selectedScenario.title}</h3>
                <p>{selectedScenario.owner}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>Recovery Target</dt>
                  <dd>{selectedScenario.recoveryTarget}</dd>
                </div>
                <div>
                  <dt>Current RTO</dt>
                  <dd>{selectedScenario.currentRto}</dd>
                </div>
                <div>
                  <dt>Current RPO</dt>
                  <dd>{selectedScenario.currentRpo}</dd>
                </div>
                <div>
                  <dt>الجاهزية</dt>
                  <dd>{selectedScenario.readiness}%</dd>
                </div>
              </dl>

              <div className={styles.impactBox}>
                <span>أثر التعافي</span>
                <strong>{selectedScenario.impact}</strong>
              </div>

              <div className={styles.actionBox}>
                <span>الإجراء التالي</span>
                <strong>{selectedScenario.nextAction}</strong>
              </div>

              <div className={styles.aiBox}>
                <span>AVOS RESILIENCE INTELLIGENCE</span>
                <strong>
                  {selectedScenario.readiness >= 90
                    ? "الخطة جاهزة وتحقق أهداف التعافي الحالية."
                    : "يوصى بتنفيذ اختبار إضافي وتحسين زمن العودة للخدمة."}
                </strong>
              </div>

              <div className={styles.actions}>
                <button type="button">تشغيل اختبار التعافي</button>
                <button type="button">فتح Runbook</button>
                <button type="button">إنشاء خطة تحسين</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
