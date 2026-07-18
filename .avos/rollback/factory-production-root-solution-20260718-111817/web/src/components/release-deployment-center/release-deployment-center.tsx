"use client";

import { useMemo } from "react";
import {
  environmentLabels,
  releaseRecords,
  releaseStatusLabels,
} from "@/data/release-deployment-center";
import { useReleaseDeploymentCenterStore } from "@/store/release-deployment-center-store";
import styles from "./release-deployment-center.module.css";

export function ReleaseDeploymentCenter() {
  const state = useReleaseDeploymentCenterStore();

  const visibleReleases = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return releaseRecords.filter((release) => {
      const text = [
        release.version,
        release.title,
        release.owner,
        release.summary,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.environment === "all" ||
          release.environment === state.environment) &&
        (state.status === "all" || release.status === state.status) &&
        (!state.productionOnly || release.environment === "production")
      );
    });
  }, [state.environment, state.productionOnly, state.query, state.status]);

  const selectedRelease =
    releaseRecords.find(
      (release) => release.id === state.selectedReleaseId,
    ) ??
    visibleReleases[0] ??
    null;

  const productionCount = releaseRecords.filter(
    (release) => release.environment === "production",
  ).length;

  const healthyCount = releaseRecords.filter(
    (release) => release.status === "healthy",
  ).length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS ENTERPRISE RELEASE & DEPLOYMENT OS</span>
          <h1>مركز الإصدارات والنشر</h1>
          <p>
            إدارة الإصدارات والبيئات والنشر والتحقق والتراجع من مكان
            واحد مع رؤية تشغيلية كاملة.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>الإصدارات السليمة</small>
          <strong>{healthyCount}</strong>
          <span>{productionCount} على الإنتاج</span>
        </div>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث بالإصدار أو المالك أو الوصف"
        />
        <select
          value={state.environment}
          onChange={(event) => state.setEnvironment(event.target.value)}
        >
          <option value="all">كل البيئات</option>
          {Object.entries(environmentLabels).map(([value, label]) => (
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
          {Object.entries(releaseStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={state.productionOnly ? styles.active : ""}
          onClick={state.toggleProductionOnly}
        >
          الإنتاج فقط
        </button>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>RELEASE PIPELINE</span>
              <h2>سجل الإصدارات</h2>
            </div>
            <strong>{visibleReleases.length}</strong>
          </div>

          <div className={styles.releaseGrid}>
            {visibleReleases.map((release) => (
              <button
                key={release.id}
                type="button"
                onClick={() => state.selectRelease(release.id)}
                className={`${styles.releaseCard} ${
                  selectedRelease?.id === release.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{release.id}</span>
                  <span className={styles[release.status]}>
                    {releaseStatusLabels[release.status]}
                  </span>
                </div>
                <small>{environmentLabels[release.environment]}</small>
                <h3>{release.title}</h3>
                <p>{release.summary}</p>
                <div className={styles.metrics}>
                  <div>
                    <span>الإصدار</span>
                    <strong>{release.version}</strong>
                  </div>
                  <div>
                    <span>الصحة</span>
                    <strong>{release.healthScore}%</strong>
                  </div>
                  <div>
                    <span>الاختبارات</span>
                    <strong>
                      {release.testsPassed}/{release.testsTotal}
                    </strong>
                  </div>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{release.owner}</span>
                  <strong>{release.deployedAt}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedRelease && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>DEPLOYMENT CONTROL PROFILE</span>
                  <h2>{selectedRelease.version}</h2>
                </div>
                <span className={styles.badge}>
                  {environmentLabels[selectedRelease.environment]}
                </span>
              </div>

              <div className={styles.releaseHero}>
                <span>{selectedRelease.owner}</span>
                <h3>{selectedRelease.title}</h3>
                <p>{selectedRelease.summary}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>البيئة</dt>
                  <dd>{environmentLabels[selectedRelease.environment]}</dd>
                </div>
                <div>
                  <dt>الحالة</dt>
                  <dd>{releaseStatusLabels[selectedRelease.status]}</dd>
                </div>
                <div>
                  <dt>الملفات المتغيرة</dt>
                  <dd>{selectedRelease.changedFiles}</dd>
                </div>
                <div>
                  <dt>الصحة</dt>
                  <dd>{selectedRelease.healthScore}%</dd>
                </div>
              </dl>

              <div className={styles.validationBox}>
                <span>نتائج الاختبارات</span>
                <strong>
                  {selectedRelease.testsPassed}/{selectedRelease.testsTotal} ناجحة
                </strong>
              </div>

              <div className={styles.rollbackBox}>
                <span>جاهزية التراجع</span>
                <strong>
                  {selectedRelease.rollbackReady ? "جاهز" : "غير جاهز"}
                </strong>
              </div>

              <div className={styles.aiBox}>
                <span>AVOS RELEASE INTELLIGENCE</span>
                <strong>
                  {selectedRelease.healthScore >= 95
                    ? "الإصدار مستقر ومؤهل للاستمرار على البيئة الحالية."
                    : "يوصى بالمراقبة أو التراجع قبل التوسع في النشر."}
                </strong>
              </div>

              <div className={styles.actions}>
                <button type="button">نشر الإصدار</button>
                <button type="button">تشغيل التحقق</button>
                <button type="button">تراجع آمن</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
