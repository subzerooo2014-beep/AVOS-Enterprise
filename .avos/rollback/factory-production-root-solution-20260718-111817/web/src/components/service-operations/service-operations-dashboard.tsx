"use client";

import { useMemo } from "react";
import {
  serviceOperationsInsights,
  servicePriorityLabels,
  serviceRequests,
  serviceStatusLabels,
  ServiceRequest,
} from "@/data/service-operations";
import { useServiceOperationsStore } from "@/store/service-operations-store";
import styles from "./service-operations.module.css";

function slaState(request: ServiceRequest) {
  const ratio = request.elapsedMinutes / request.slaMinutes;

  if (request.status === "completed") {
    return { label: "مكتمل ضمن SLA", tone: "safe" };
  }

  if (ratio >= 1) {
    return { label: "متجاوز", tone: "danger" };
  }

  if (ratio >= 0.75) {
    return { label: "معرّض للخطر", tone: "warning" };
  }

  return { label: "ضمن المسار", tone: "safe" };
}

function money(value: number) {
  return new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ServiceOperationsDashboard() {
  const state = useServiceOperationsStore();

  const cities = useMemo(
    () => Array.from(new Set(serviceRequests.map((request) => request.city))),
    [],
  );

  const visibleRequests = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return serviceRequests.filter((request) => {
      const searchable = [
        request.id,
        request.customerName,
        request.vehicle,
        request.service,
        request.provider,
        request.branch,
        request.assignee,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || searchable.includes(query)) &&
        (state.status === "all" || request.status === state.status) &&
        (state.priority === "all" || request.priority === state.priority) &&
        (state.city === "all" || request.city === state.city)
      );
    });
  }, [state.city, state.priority, state.query, state.status]);

  const selectedRequest =
    serviceRequests.find(
      (request) => request.id === state.selectedRequestId,
    ) ?? visibleRequests[0] ?? null;

  const activeRequests = serviceRequests.filter(
    (request) => request.status !== "completed",
  );
  const atRisk = activeRequests.filter((request) => {
    const ratio = request.elapsedMinutes / request.slaMinutes;
    return ratio >= 0.75 || request.status === "escalated";
  });
  const completed = serviceRequests.filter(
    (request) => request.status === "completed",
  );
  const pipelineValue = activeRequests.reduce(
    (total, request) => total + request.estimatedValue,
    0,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>AVOS Service Operations OS</span>
          <h1>مركز تشغيل الخدمات ومراقبة SLA</h1>
          <p>
            تحكم موحد في طلبات العملاء، التعيين، التنفيذ، المخاطر،
            التصعيد، جودة التجربة، وفرص الإيراد.
          </p>
        </div>
        <div className={styles.heroBadge}>
          <small>حالة العمليات</small>
          <strong>تشغيل ذكي مباشر</strong>
          <span>آخر مزامنة: الآن</span>
        </div>
      </section>

      <section className={styles.kpis}>
        <article>
          <span>الطلبات النشطة</span>
          <strong>{activeRequests.length}</strong>
          <small>عبر جميع القنوات</small>
        </article>
        <article>
          <span>معرّضة لخطر SLA</span>
          <strong>{atRisk.length}</strong>
          <small>تحتاج متابعة فورية</small>
        </article>
        <article>
          <span>مكتملة اليوم</span>
          <strong>{completed.length}</strong>
          <small>بجودة تشغيل مستقرة</small>
        </article>
        <article>
          <span>قيمة خط التشغيل</span>
          <strong>{money(pipelineValue)}</strong>
          <small>طلبات غير مكتملة</small>
        </article>
      </section>

      <section className={styles.filters}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث برقم الطلب، العميل، المركبة، الخدمة أو الموظف"
          aria-label="بحث طلبات الخدمة"
        />
        <select
          value={state.status}
          onChange={(event) =>
            state.setStatus(
              event.target.value as typeof state.status,
            )
          }
          aria-label="حالة الطلب"
        >
          <option value="all">كل الحالات</option>
          {Object.entries(serviceStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={state.priority}
          onChange={(event) =>
            state.setPriority(
              event.target.value as typeof state.priority,
            )
          }
          aria-label="أولوية الطلب"
        >
          <option value="all">كل الأولويات</option>
          {Object.entries(servicePriorityLabels).map(([value, label]) => (
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
        <div className={styles.queuePanel}>
          <div className={styles.sectionHeading}>
            <div>
              <span>LIVE SERVICE QUEUE</span>
              <h2>طابور طلبات الخدمة</h2>
            </div>
            <strong>{visibleRequests.length} طلبات</strong>
          </div>

          <div className={styles.queue}>
            {visibleRequests.map((request) => {
              const sla = slaState(request);
              const isSelected = selectedRequest?.id === request.id;

              return (
                <button
                  key={request.id}
                  type="button"
                  className={`${styles.requestCard} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => state.selectRequest(request.id)}
                >
                  <div className={styles.requestTopline}>
                    <span>{request.id}</span>
                    <span
                      className={`${styles.slaPill} ${
                        styles[sla.tone]
                      }`}
                    >
                      {sla.label}
                    </span>
                  </div>
                  <h3>{request.service}</h3>
                  <p>
                    {request.customerName} · {request.vehicle}
                  </p>
                  <div className={styles.requestMeta}>
                    <span>{request.city}</span>
                    <span>{request.assignee}</span>
                    <span>
                      {servicePriorityLabels[request.priority]}
                    </span>
                  </div>
                  <div className={styles.progressTrack}>
                    <span style={{ width: `${request.progress}%` }} />
                  </div>
                  <div className={styles.progressCopy}>
                    <span>{serviceStatusLabels[request.status]}</span>
                    <strong>{request.progress}%</strong>
                  </div>
                </button>
              );
            })}

            {visibleRequests.length === 0 && (
              <div className={styles.emptyState}>
                لا توجد طلبات مطابقة للفلاتر الحالية.
              </div>
            )}
          </div>
        </div>

        <aside className={styles.detailsPanel}>
          {selectedRequest ? (
            <>
              <div className={styles.detailsHeading}>
                <div>
                  <span>REQUEST CONTROL</span>
                  <h2>{selectedRequest.id}</h2>
                </div>
                <span
                  className={`${styles.priorityBadge} ${
                    styles[selectedRequest.priority]
                  }`}
                >
                  {servicePriorityLabels[selectedRequest.priority]}
                </span>
              </div>

              <div className={styles.detailHero}>
                <span>{selectedRequest.service}</span>
                <h3>{selectedRequest.customerName}</h3>
                <p>{selectedRequest.vehicle}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>المزود</dt>
                  <dd>{selectedRequest.provider}</dd>
                </div>
                <div>
                  <dt>الفرع</dt>
                  <dd>{selectedRequest.branch}</dd>
                </div>
                <div>
                  <dt>المسؤول</dt>
                  <dd>{selectedRequest.assignee}</dd>
                </div>
                <div>
                  <dt>القيمة المتوقعة</dt>
                  <dd>{money(selectedRequest.estimatedValue)}</dd>
                </div>
              </dl>

              <div className={styles.slaCard}>
                <div>
                  <span>SLA CONTROL</span>
                  <strong>
                    {selectedRequest.elapsedMinutes} /{" "}
                    {selectedRequest.slaMinutes} دقيقة
                  </strong>
                </div>
                <b>{slaState(selectedRequest).label}</b>
                <div className={styles.slaTrack}>
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedRequest.elapsedMinutes /
                          selectedRequest.slaMinutes) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className={styles.aiAction}>
                <span>AVOS NEXT BEST ACTION</span>
                <strong>{selectedRequest.nextBestAction}</strong>
                <small>
                  درجة خطر الذكاء التشغيلي:{" "}
                  {selectedRequest.aiRiskScore}/100
                </small>
              </div>

              <div className={styles.actions}>
                <button type="button">تحديث الحالة</button>
                <button type="button">إعادة التعيين</button>
                <button type="button">تصعيد ذكي</button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>اختر طلباً لعرض التفاصيل.</div>
          )}
        </aside>
      </section>

      <section className={styles.intelligence}>
        <div className={styles.sectionHeading}>
          <div>
            <span>AVOS OPERATIONS INTELLIGENCE</span>
            <h2>تنبيهات وفرص تشغيلية</h2>
          </div>
        </div>
        <div className={styles.insightGrid}>
          {serviceOperationsInsights.map((insight) => (
            <article key={insight.id}>
              <span className={styles[insight.severity]}>
                {insight.severity === "critical"
                  ? "تدخل عاجل"
                  : insight.severity === "growth"
                    ? "فرصة نمو"
                    : "تحسين تشغيل"}
              </span>
              <h3>{insight.title}</h3>
              <p>{insight.detail}</p>
              <button type="button">تنفيذ التوصية</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
