"use client";

import { useMemo } from "react";
import {
  qualityCases,
  qualitySeverityLabels,
  qualityStatusLabels,
  qualitySurveys,
  QualityCase,
} from "@/data/service-quality";
import { useServiceQualityStore } from "@/store/service-quality-store";
import styles from "./service-quality.module.css";

function money(value: number) {
  return new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

function responseState(item: QualityCase) {
  if (item.responseMinutes > item.targetMinutes) {
    return { label: "متجاوز للهدف", tone: "danger" };
  }

  if (item.responseMinutes >= item.targetMinutes * 0.75) {
    return { label: "قريب من الحد", tone: "warning" };
  }

  return { label: "ضمن الهدف", tone: "safe" };
}

export function ServiceQualityDashboard() {
  const state = useServiceQualityStore();

  const cities = useMemo(
    () => Array.from(new Set(qualityCases.map((item) => item.city))),
    [],
  );

  const visibleCases = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return qualityCases.filter((item) => {
      const searchable = [
        item.id,
        item.requestId,
        item.customerName,
        item.vehicle,
        item.service,
        item.provider,
        item.branch,
        item.owner,
        item.complaint,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || searchable.includes(query)) &&
        (state.status === "all" || item.status === state.status) &&
        (state.severity === "all" || item.severity === state.severity) &&
        (state.city === "all" || item.city === state.city)
      );
    });
  }, [state.city, state.query, state.severity, state.status]);

  const selectedCase =
    qualityCases.find((item) => item.id === state.selectedCaseId) ??
    visibleCases[0] ??
    null;

  const activeCases = qualityCases.filter(
    (item) => !["resolved", "closed"].includes(item.status),
  );
  const criticalCases = activeCases.filter(
    (item) => item.severity === "critical" || item.severity === "high",
  );
  const averageScore = Math.round(
    qualitySurveys.reduce((total, survey) => total + survey.score, 0) /
      qualitySurveys.length,
  );
  const recoveryExposure = activeCases.reduce(
    (total, item) => total + item.estimatedRecoveryCost,
    0,
  );
  const retainedValue = activeCases.reduce(
    (total, item) => total + item.customerLifetimeValue,
    0,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>
            AVOS Service Quality & Customer Experience OS
          </span>
          <h1>مركز جودة الخدمات وتجربة العملاء</h1>
          <p>
            مراقبة موحدة للرضا والشكاوى والمشاعر، اكتشاف جذور
            المشكلات، وتفعيل استرداد ذكي للتجربة قبل فقدان العميل.
          </p>
        </div>
        <div className={styles.heroSignal}>
          <small>مؤشر التجربة المباشر</small>
          <strong>{averageScore}/100</strong>
          <span>الجودة تحت المراقبة المستمرة</span>
        </div>
      </section>

      <section className={styles.kpis}>
        <article>
          <span>حالات الجودة النشطة</span>
          <strong>{activeCases.length}</strong>
          <small>تحتاج متابعة أو استرداد</small>
        </article>
        <article>
          <span>حالات عالية الخطورة</span>
          <strong>{criticalCases.length}</strong>
          <small>أولوية تدخل فوري</small>
        </article>
        <article>
          <span>متوسط تجربة العميل</span>
          <strong>{averageScore}%</strong>
          <small>من أحدث الاستبيانات</small>
        </article>
        <article>
          <span>قيمة العملاء المحمية</span>
          <strong>{money(retainedValue)}</strong>
          <small>قيمة عمرية معرضة للخطر</small>
        </article>
      </section>

      <section className={styles.filters}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث بالحالة، الطلب، العميل، المركبة، المزود أو الشكوى"
          aria-label="بحث حالات الجودة"
        />
        <select
          value={state.status}
          onChange={(event) =>
            state.setStatus(event.target.value as typeof state.status)
          }
          aria-label="حالة الجودة"
        >
          <option value="all">كل الحالات</option>
          {Object.entries(qualityStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={state.severity}
          onChange={(event) =>
            state.setSeverity(event.target.value as typeof state.severity)
          }
          aria-label="درجة الخطورة"
        >
          <option value="all">كل درجات الخطورة</option>
          {Object.entries(qualitySeverityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={state.city}
          onChange={(event) => state.setCity(event.target.value)}
          aria-label="المدينة"
        >
          <option value="all">كل المدن</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <button type="button" onClick={state.resetFilters}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.casePanel}>
          <div className={styles.sectionHeading}>
            <div>
              <span>QUALITY CASE COMMAND</span>
              <h2>حالات الجودة واسترداد التجربة</h2>
            </div>
            <strong>{visibleCases.length} حالات</strong>
          </div>

          <div className={styles.caseGrid}>
            {visibleCases.map((item) => {
              const response = responseState(item);
              const isSelected = selectedCase?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.caseCard} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => state.selectCase(item.id)}
                >
                  <div className={styles.cardTopline}>
                    <span>{item.id}</span>
                    <span
                      className={`${styles.severityPill} ${
                        styles[item.severity]
                      }`}
                    >
                      {qualitySeverityLabels[item.severity]}
                    </span>
                  </div>
                  <h3>{item.service}</h3>
                  <p>
                    {item.customerName} · {item.vehicle}
                  </p>
                  <div className={styles.cardMeta}>
                    <span>{item.city}</span>
                    <span>{item.owner}</span>
                    <span>{qualityStatusLabels[item.status]}</span>
                  </div>
                  <div className={styles.scoreRow}>
                    <div>
                      <small>تقييم التجربة</small>
                      <strong>{item.score}%</strong>
                    </div>
                    <div>
                      <small>المشاعر</small>
                      <strong>{item.sentiment}%</strong>
                    </div>
                    <span className={styles[response.tone]}>
                      {response.label}
                    </span>
                  </div>
                </button>
              );
            })}

            {visibleCases.length === 0 && (
              <div className={styles.emptyState}>
                لا توجد حالات مطابقة للفلاتر الحالية.
              </div>
            )}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedCase ? (
            <>
              <div className={styles.detailHeading}>
                <div>
                  <span>EXPERIENCE RECOVERY CONTROL</span>
                  <h2>{selectedCase.id}</h2>
                </div>
                <span
                  className={`${styles.severityPill} ${
                    styles[selectedCase.severity]
                  }`}
                >
                  {qualitySeverityLabels[selectedCase.severity]}
                </span>
              </div>

              <div className={styles.customerHero}>
                <span>{selectedCase.service}</span>
                <h3>{selectedCase.customerName}</h3>
                <p>
                  {selectedCase.vehicle} · {selectedCase.requestId}
                </p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>المزود</dt>
                  <dd>{selectedCase.provider}</dd>
                </div>
                <div>
                  <dt>الفرع</dt>
                  <dd>{selectedCase.branch}</dd>
                </div>
                <div>
                  <dt>مالك الحالة</dt>
                  <dd>{selectedCase.owner}</dd>
                </div>
                <div>
                  <dt>قيمة العميل</dt>
                  <dd>{money(selectedCase.customerLifetimeValue)}</dd>
                </div>
              </dl>

              <div className={styles.issueBlock}>
                <span>صوت العميل</span>
                <strong>{selectedCase.complaint}</strong>
              </div>

              <div className={styles.rootCause}>
                <span>ROOT CAUSE INTELLIGENCE</span>
                <strong>{selectedCase.rootCause}</strong>
              </div>

              <div className={styles.aiRecovery}>
                <span>AVOS AI RECOVERY PLAN</span>
                <strong>{selectedCase.aiRecommendation}</strong>
                <small>
                  تكلفة الاسترداد المتوقعة:{" "}
                  {money(selectedCase.estimatedRecoveryCost)}
                </small>
              </div>

              <div className={styles.recoveryPlan}>
                <span>خطة الاسترداد المعتمدة</span>
                <p>{selectedCase.recoveryPlan}</p>
              </div>

              <div className={styles.actions}>
                <button type="button">بدء الاسترداد</button>
                <button type="button">تعيين مسؤول</button>
                <button type="button">تصعيد للجودة</button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>اختر حالة لعرض التفاصيل.</div>
          )}
        </aside>
      </section>

      <section className={styles.intelligenceGrid}>
        <article className={styles.surveyPanel}>
          <div className={styles.sectionHeading}>
            <div>
              <span>VOICE OF CUSTOMER</span>
              <h2>أحدث الاستبيانات</h2>
            </div>
          </div>
          <div className={styles.surveyList}>
            {qualitySurveys.map((survey) => (
              <div key={survey.id}>
                <div>
                  <strong>{survey.customerName}</strong>
                  <small>{survey.requestId}</small>
                </div>
                <p>{survey.comment}</p>
                <div className={styles.surveyScores}>
                  <span>التجربة {survey.score}%</span>
                  <span>NPS {survey.nps}/10</span>
                  <span>CSAT {survey.csat}%</span>
                  <span>الجهد {survey.effort}%</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.aiPanel}>
          <span>AVOS EXPERIENCE INTELLIGENCE</span>
          <h2>قرار الجودة التالي</h2>
          <strong>
            الأولوية الحالية: معالجة فجوات التحديث الاستباقي للعميل
            في خدمات الميدان والتشخيص.
          </strong>
          <p>
            رصد AVOS نمطاً مشتركاً في الحالات عالية الخطورة: نقص
            التحديثات قبل تجاوز الموعد المتوقع. يوصى بتفعيل إشعار
            تلقائي ومزود احتياطي قبل 15 دقيقة من خطر التجاوز.
          </p>
          <div>
            <span>التعرض المالي للاسترداد</span>
            <b>{money(recoveryExposure)}</b>
          </div>
          <button type="button">تشغيل خطة التحسين</button>
        </article>
      </section>
    </main>
  );
}
