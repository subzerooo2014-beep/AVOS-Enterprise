"use client";

import { useMemo } from "react";
import {
  changeCategoryLabels,
  changeEnvironmentLabels,
  changeRequests,
  changeStatusLabels,
} from "@/data/change-configuration-center";
import { useChangeConfigurationCenterStore } from "@/store/change-configuration-center-store";
import styles from "./change-configuration-center.module.css";

const riskLabels = {
  low: "منخفضة",
  medium: "متوسطة",
  high: "عالية",
  critical: "حرجة",
};

export function ChangeConfigurationCenter() {
  const state = useChangeConfigurationCenterStore();

  const visibleChanges = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return changeRequests.filter((change) => {
      const text = [
        change.title,
        change.description,
        change.owner,
        change.validationPlan,
        change.businessImpact,
        ...change.affectedServices,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.environment === "all" ||
          change.environment === state.environment) &&
        (state.status === "all" || change.status === state.status) &&
        (!state.highRiskOnly ||
          change.risk === "high" ||
          change.risk === "critical")
      );
    });
  }, [state.environment, state.highRiskOnly, state.query, state.status]);

  const selectedChange =
    changeRequests.find((change) => change.id === state.selectedChangeId) ??
    visibleChanges[0] ??
    null;

  const approvedCount = changeRequests.filter(
    (change) =>
      change.status === "approved" ||
      change.status === "scheduled" ||
      change.status === "completed",
  ).length;

  const rollbackReadyCount = changeRequests.filter(
    (change) => change.rollbackReady,
  ).length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS ENTERPRISE CHANGE & CONFIGURATION OS</span>
          <h1>مركز التغيير والتهيئة</h1>
          <p>
            إدارة طلبات التغيير والاعتمادات والجدولة والتراجع والتحقق
            عبر جميع بيئات AVOS.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>التغييرات المعتمدة</small>
          <strong>{approvedCount}</strong>
          <span>{rollbackReadyCount} خطط تراجع جاهزة</span>
        </div>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في التغييرات والخدمات وخطط التحقق"
        />
        <select
          value={state.environment}
          onChange={(event) => state.setEnvironment(event.target.value)}
        >
          <option value="all">كل البيئات</option>
          {Object.entries(changeEnvironmentLabels).map(([value, label]) => (
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
          {Object.entries(changeStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={state.highRiskOnly ? styles.active : ""}
          onClick={state.toggleHighRiskOnly}
        >
          المخاطر العالية
        </button>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>CHANGE REQUEST PIPELINE</span>
              <h2>طلبات التغيير</h2>
            </div>
            <strong>{visibleChanges.length}</strong>
          </div>

          <div className={styles.changeGrid}>
            {visibleChanges.map((change) => (
              <button
                key={change.id}
                type="button"
                onClick={() => state.selectChange(change.id)}
                className={`${styles.changeCard} ${
                  selectedChange?.id === change.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{change.id}</span>
                  <span className={styles[change.risk]}>
                    {riskLabels[change.risk]}
                  </span>
                </div>
                <small>{changeCategoryLabels[change.category]}</small>
                <h3>{change.title}</h3>
                <p>{change.description}</p>
                <div className={styles.metrics}>
                  <div>
                    <span>البيئة</span>
                    <strong>{changeEnvironmentLabels[change.environment]}</strong>
                  </div>
                  <div>
                    <span>الموافقات</span>
                    <strong>
                      {change.approvals}/{change.approvalsRequired}
                    </strong>
                  </div>
                  <div>
                    <span>الحالة</span>
                    <strong>{changeStatusLabels[change.status]}</strong>
                  </div>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{change.owner}</span>
                  <strong>{change.scheduledAt}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedChange && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>CHANGE CONTROL PROFILE</span>
                  <h2>{selectedChange.id}</h2>
                </div>
                <span className={styles.badge}>
                  {changeStatusLabels[selectedChange.status]}
                </span>
              </div>

              <div className={styles.changeHero}>
                <span>{changeEnvironmentLabels[selectedChange.environment]}</span>
                <h3>{selectedChange.title}</h3>
                <p>{selectedChange.description}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>المالك</dt>
                  <dd>{selectedChange.owner}</dd>
                </div>
                <div>
                  <dt>الفئة</dt>
                  <dd>{changeCategoryLabels[selectedChange.category]}</dd>
                </div>
                <div>
                  <dt>المخاطر</dt>
                  <dd>{riskLabels[selectedChange.risk]}</dd>
                </div>
                <div>
                  <dt>الجدولة</dt>
                  <dd>{selectedChange.scheduledAt}</dd>
                </div>
              </dl>

              <div className={styles.servicesBox}>
                <span>الخدمات المتأثرة</span>
                {selectedChange.affectedServices.map((service) => (
                  <strong key={service}>{service}</strong>
                ))}
              </div>

              <div className={styles.validationBox}>
                <span>خطة التحقق</span>
                <strong>{selectedChange.validationPlan}</strong>
              </div>

              <div className={styles.impactBox}>
                <span>الأثر التجاري</span>
                <strong>{selectedChange.businessImpact}</strong>
              </div>

              <div className={styles.aiBox}>
                <span>AVOS CHANGE INTELLIGENCE</span>
                <strong>
                  {selectedChange.rollbackReady
                    ? "خطة التراجع جاهزة ويمكن تنفيذ التغيير بعد اكتمال الموافقات."
                    : "يوصى بعدم الجدولة قبل تجهيز خطة تراجع معتمدة."}
                </strong>
              </div>

              <div className={styles.actions}>
                <button type="button">اعتماد التغيير</button>
                <button type="button">تشغيل التحقق</button>
                <button type="button">بدء التراجع</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
