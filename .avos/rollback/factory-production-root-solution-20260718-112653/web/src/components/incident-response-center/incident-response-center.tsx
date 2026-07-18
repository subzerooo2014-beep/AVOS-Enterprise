"use client";

import { useMemo } from "react";
import {
  incidentRecords,
  incidentSeverityLabels,
  incidentStatusLabels,
} from "@/data/incident-response-center";
import { useIncidentResponseCenterStore } from "@/store/incident-response-center-store";
import styles from "./incident-response-center.module.css";

export function IncidentResponseCenter() {
  const state = useIncidentResponseCenterStore();

  const visibleIncidents = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return incidentRecords.filter((incident) => {
      const text = [
        incident.title,
        incident.description,
        incident.owner,
        incident.service,
        incident.playbook,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.severity === "all" || incident.severity === state.severity) &&
        (state.status === "all" || incident.status === state.status) &&
        (!state.unresolvedOnly || incident.status !== "resolved")
      );
    });
  }, [state.query, state.severity, state.status, state.unresolvedOnly]);

  const selectedIncident =
    incidentRecords.find(
      (incident) => incident.id === state.selectedIncidentId,
    ) ??
    visibleIncidents[0] ??
    null;

  const openCount = incidentRecords.filter(
    (incident) => incident.status !== "resolved",
  ).length;

  const criticalCount = incidentRecords.filter(
    (incident) => incident.severity === "critical",
  ).length;

  const affectedUsers = incidentRecords.reduce(
    (sum, incident) => sum + incident.affectedUsers,
    0,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS ENTERPRISE INCIDENT & RESPONSE OS</span>
          <h1>مركز الحوادث والاستجابة</h1>
          <p>
            مراقبة الحوادث والتصعيدات وخطط الاحتواء والتعافي مع قياس
            التأثير وسرعة الاستجابة.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>الحوادث المفتوحة</small>
          <strong>{openCount}</strong>
          <span>{criticalCount} حوادث حرجة</span>
        </div>
      </section>

      <section className={styles.kpis}>
        <article>
          <span>المتأثرون</span>
          <strong>{affectedUsers}</strong>
          <small>مستخدمون محتملون</small>
        </article>
        <article>
          <span>قيد التحقيق</span>
          <strong>{incidentRecords.filter((i) => i.status === "investigating").length}</strong>
          <small>حوادث نشطة</small>
        </article>
        <article>
          <span>تم الاحتواء</span>
          <strong>{incidentRecords.filter((i) => i.status === "mitigated").length}</strong>
          <small>بانتظار الإغلاق</small>
        </article>
        <article>
          <span>الحوادث المغلقة</span>
          <strong>{incidentRecords.filter((i) => i.status === "resolved").length}</strong>
          <small>تم التعافي</small>
        </article>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في الحوادث والخدمات والمالكين وPlaybook"
        />
        <select
          value={state.severity}
          onChange={(event) => state.setSeverity(event.target.value)}
        >
          <option value="all">كل الخطورة</option>
          {Object.entries(incidentSeverityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={state.status}
          onChange={(event) => state.setStatus(event.target.value)}
        >
          <option value="all">كل الحالات</option>
          {Object.entries(incidentStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={state.unresolvedOnly ? styles.active : ""}
          onClick={state.toggleUnresolvedOnly}
        >
          غير المغلقة فقط
        </button>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>INCIDENT RESPONSE QUEUE</span>
              <h2>قائمة الحوادث</h2>
            </div>
            <strong>{visibleIncidents.length}</strong>
          </div>

          <div className={styles.incidentGrid}>
            {visibleIncidents.map((incident) => (
              <button
                key={incident.id}
                type="button"
                onClick={() => state.selectIncident(incident.id)}
                className={`${styles.incidentCard} ${
                  selectedIncident?.id === incident.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{incident.id}</span>
                  <span className={styles[incident.severity]}>
                    {incidentSeverityLabels[incident.severity]}
                  </span>
                </div>
                <small>{incident.service}</small>
                <h3>{incident.title}</h3>
                <p>{incident.description}</p>
                <div className={styles.metrics}>
                  <div>
                    <span>المدة</span>
                    <strong>{incident.elapsedMinutes}د</strong>
                  </div>
                  <div>
                    <span>المتأثرون</span>
                    <strong>{incident.affectedUsers}</strong>
                  </div>
                  <div>
                    <span>الحالة</span>
                    <strong>{incidentStatusLabels[incident.status]}</strong>
                  </div>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{incident.owner}</span>
                  <strong>{incident.startedAt}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedIncident && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>INCIDENT COMMAND PROFILE</span>
                  <h2>{selectedIncident.id}</h2>
                </div>
                <span className={styles.badge}>
                  {incidentStatusLabels[selectedIncident.status]}
                </span>
              </div>

              <div className={styles.incidentHero}>
                <span>{selectedIncident.service}</span>
                <h3>{selectedIncident.title}</h3>
                <p>{selectedIncident.description}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>المالك</dt>
                  <dd>{selectedIncident.owner}</dd>
                </div>
                <div>
                  <dt>الخطورة</dt>
                  <dd>{incidentSeverityLabels[selectedIncident.severity]}</dd>
                </div>
                <div>
                  <dt>المدة</dt>
                  <dd>{selectedIncident.elapsedMinutes} دقيقة</dd>
                </div>
                <div>
                  <dt>المتأثرون</dt>
                  <dd>{selectedIncident.affectedUsers}</dd>
                </div>
              </dl>

              <div className={styles.impactBox}>
                <span>التأثير التجاري</span>
                <strong>{selectedIncident.businessImpact}</strong>
              </div>

              <div className={styles.actionBox}>
                <span>الإجراء التالي</span>
                <strong>{selectedIncident.nextAction}</strong>
              </div>

              <div className={styles.playbookBox}>
                <span>Playbook</span>
                <strong>{selectedIncident.playbook}</strong>
              </div>

              <div className={styles.aiBox}>
                <span>AVOS INCIDENT INTELLIGENCE</span>
                <strong>
                  {selectedIncident.severity === "critical"
                    ? "يوصى بتصعيد فوري وتفعيل غرفة الاستجابة التنفيذية."
                    : "الحادث تحت السيطرة مع استمرار تنفيذ خطة الاحتواء."}
                </strong>
              </div>

              <div className={styles.actions}>
                <button type="button">تشغيل Playbook</button>
                <button type="button">فتح غرفة الاستجابة</button>
                <button type="button">إغلاق الحادث</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
