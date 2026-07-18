"use client";

import { useMemo } from "react";
import {
  providerMetrics,
  providerRiskLabels,
  providerStatusLabels,
  slaIncidents,
} from "@/data/service-provider-performance";
import { useServiceProviderPerformanceStore } from "@/store/service-provider-performance-store";
import styles from "./service-provider-performance.module.css";

function money(value: number) {
  return new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

function percent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

export function ServiceProviderPerformanceDashboard() {
  const state = useServiceProviderPerformanceStore();

  const cities = useMemo(
    () => Array.from(new Set(providerMetrics.map((item) => item.city))),
    [],
  );

  const visibleProviders = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return providerMetrics.filter((provider) => {
      const searchable = [
        provider.id,
        provider.providerName,
        provider.category,
        provider.city,
        provider.aiDecision,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || searchable.includes(query)) &&
        (state.city === "all" || provider.city === state.city) &&
        (state.risk === "all" || provider.risk === state.risk) &&
        (state.status === "all" || provider.status === state.status)
      );
    });
  }, [state.city, state.query, state.risk, state.status]);

  const selectedProvider =
    providerMetrics.find(
      (item) => item.id === state.selectedProviderId,
    ) ??
    visibleProviders[0] ??
    null;

  const selectedIncidents = selectedProvider
    ? slaIncidents.filter(
        (incident) => incident.providerId === selectedProvider.id,
      )
    : [];

  const totalActiveRequests = providerMetrics.reduce(
    (total, provider) => total + provider.activeRequests,
    0,
  );
  const averageSla = Math.round(
    providerMetrics.reduce(
      (total, provider) => total + provider.slaCompliance,
      0,
    ) / providerMetrics.length,
  );
  const revenueToday = providerMetrics.reduce(
    (total, provider) => total + provider.revenueToday,
    0,
  );
  const openEscalations = providerMetrics.reduce(
    (total, provider) => total + provider.openEscalations,
    0,
  );
  const atRiskProviders = providerMetrics.filter(
    (provider) =>
      provider.risk === "high" || provider.risk === "critical",
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS PROVIDER PERFORMANCE & SLA OS</span>
          <h1>مركز أداء مزودي الخدمات وSLA</h1>
          <p>
            متابعة لحظية لأداء المزودين، الالتزام باتفاقيات مستوى
            الخدمة، المخاطر، التصعيد، الإيرادات، وجودة التنفيذ.
          </p>
        </div>
        <div className={styles.heroScore}>
          <small>مؤشر شبكة المزودين</small>
          <strong>{averageSla}/100</strong>
          <span>التزام SLA الكلي</span>
        </div>
      </section>

      <section className={styles.kpis}>
        <article>
          <span>الطلبات النشطة</span>
          <strong>{totalActiveRequests}</strong>
          <small>عبر جميع المزودين</small>
        </article>
        <article>
          <span>متوسط الالتزام بـ SLA</span>
          <strong>{averageSla}%</strong>
          <small>مؤشر الشبكة المباشر</small>
        </article>
        <article>
          <span>إيراد اليوم</span>
          <strong>{money(revenueToday)}</strong>
          <small>من خدمات الشبكة</small>
        </article>
        <article>
          <span>التصعيدات المفتوحة</span>
          <strong>{openEscalations}</strong>
          <small>{atRiskProviders.length} مزودين عاليي الخطورة</small>
        </article>
      </section>

      <section className={styles.filters}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث بالمزود، الفئة، المدينة أو القرار الذكي"
          aria-label="بحث المزودين"
        />
        <select
          value={state.city}
          onChange={(event) => state.setCity(event.target.value)}
        >
          <option value="all">كل المدن</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          value={state.risk}
          onChange={(event) =>
            state.setRisk(event.target.value as typeof state.risk)
          }
        >
          <option value="all">كل المخاطر</option>
          {Object.entries(providerRiskLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={state.status}
          onChange={(event) =>
            state.setStatus(event.target.value as typeof state.status)
          }
        >
          <option value="all">كل الحالات</option>
          {Object.entries(providerStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button type="button" onClick={state.resetFilters}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.providersPanel}>
          <div className={styles.sectionHeading}>
            <div>
              <span>PROVIDER NETWORK COMMAND</span>
              <h2>شبكة مزودي الخدمات</h2>
            </div>
            <strong>{visibleProviders.length} مزودين</strong>
          </div>

          <div className={styles.providerGrid}>
            {visibleProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => state.selectProvider(provider.id)}
                className={`${styles.providerCard} ${
                  selectedProvider?.id === provider.id
                    ? styles.selected
                    : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{provider.id}</span>
                  <span
                    className={`${styles.riskPill} ${
                      styles[provider.risk]
                    }`}
                  >
                    {providerRiskLabels[provider.risk]}
                  </span>
                </div>
                <h3>{provider.providerName}</h3>
                <p>
                  {provider.category} · {provider.city} ·{" "}
                  {provider.branches} فروع
                </p>
                <div className={styles.metricStrip}>
                  <div>
                    <small>SLA</small>
                    <strong>{provider.slaCompliance}%</strong>
                  </div>
                  <div>
                    <small>رضا العملاء</small>
                    <strong>{provider.customerScore}%</strong>
                  </div>
                  <div>
                    <small>إعادة العمل</small>
                    <strong>{percent(provider.reworkRate)}</strong>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span>{providerStatusLabels[provider.status]}</span>
                  <span
                    className={
                      provider.trend >= 0
                        ? styles.positiveTrend
                        : styles.negativeTrend
                    }
                  >
                    {provider.trend >= 0 ? "+" : ""}
                    {provider.trend}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedProvider && (
            <>
              <div className={styles.detailHeading}>
                <div>
                  <span>PROVIDER CONTROL PROFILE</span>
                  <h2>{selectedProvider.providerName}</h2>
                </div>
                <span
                  className={`${styles.riskPill} ${
                    styles[selectedProvider.risk]
                  }`}
                >
                  {providerRiskLabels[selectedProvider.risk]}
                </span>
              </div>

              <div className={styles.providerHero}>
                <span>{selectedProvider.category}</span>
                <strong>{selectedProvider.slaCompliance}%</strong>
                <small>التزام SLA الحالي</small>
              </div>

              <div className={styles.detailMetrics}>
                <div>
                  <span>الطلبات النشطة</span>
                  <strong>{selectedProvider.activeRequests}</strong>
                </div>
                <div>
                  <span>المكتمل اليوم</span>
                  <strong>{selectedProvider.completedToday}</strong>
                </div>
                <div>
                  <span>الاستجابة الأولى</span>
                  <strong>
                    {selectedProvider.firstResponseMinutes} د
                  </strong>
                </div>
                <div>
                  <span>استخدام الفنيين</span>
                  <strong>
                    {selectedProvider.technicianUtilization}%
                  </strong>
                </div>
                <div>
                  <span>نسبة القبول</span>
                  <strong>{selectedProvider.acceptanceRate}%</strong>
                </div>
                <div>
                  <span>الإلغاءات</span>
                  <strong>
                    {percent(selectedProvider.cancellationRate)}
                  </strong>
                </div>
              </div>

              <div className={styles.aiDecision}>
                <span>AVOS AI PROVIDER DECISION</span>
                <strong>{selectedProvider.aiDecision}</strong>
              </div>

              <div className={styles.nextAction}>
                <span>الإجراء التنفيذي التالي</span>
                <p>{selectedProvider.nextAction}</p>
              </div>

              <div className={styles.financialBox}>
                <div>
                  <span>إيراد اليوم</span>
                  <strong>{money(selectedProvider.revenueToday)}</strong>
                </div>
                <div>
                  <span>الإيراد الشهري المتوقع</span>
                  <strong>
                    {money(selectedProvider.projectedMonthlyRevenue)}
                  </strong>
                </div>
              </div>

              <div className={styles.actions}>
                <button type="button">اعتماد الإجراء</button>
                <button type="button">تعديل التخصيص</button>
                <button type="button">فتح خطة تصحيح</button>
              </div>
            </>
          )}
        </aside>
      </section>

      <section className={styles.incidentSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span>SLA INCIDENT & ESCALATION CENTER</span>
            <h2>حوادث SLA والتصعيدات</h2>
          </div>
          <strong>{selectedIncidents.length} حوادث للمزود</strong>
        </div>

        <div className={styles.incidentGrid}>
          {(selectedIncidents.length
            ? selectedIncidents
            : slaIncidents
          ).map((incident) => (
            <article key={incident.id}>
              <div className={styles.cardTop}>
                <span>{incident.id}</span>
                <span
                  className={`${styles.riskPill} ${
                    styles[incident.severity]
                  }`}
                >
                  {providerRiskLabels[incident.severity]}
                </span>
              </div>
              <h3>{incident.breachedMetric}</h3>
              <p>
                {incident.providerName} · {incident.requestId} ·{" "}
                {incident.service}
              </p>
              <dl>
                <div>
                  <dt>الهدف</dt>
                  <dd>{incident.target}</dd>
                </div>
                <div>
                  <dt>الفعلي</dt>
                  <dd>{incident.actual}</dd>
                </div>
                <div>
                  <dt>المسؤول</dt>
                  <dd>{incident.owner}</dd>
                </div>
              </dl>
              <div className={styles.incidentImpact}>
                <span>الأثر</span>
                <strong>{incident.impact}</strong>
              </div>
              <div className={styles.recommendation}>
                <span>توصية AVOS</span>
                <strong>{incident.recommendation}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
