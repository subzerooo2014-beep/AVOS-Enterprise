"use client";

import { useMemo } from "react";
import {
  focusCategoryLabels,
  focusPriorities,
  focusStatusLabels,
} from "@/data/priority-focus-center";
import { usePriorityFocusCenterStore } from "@/store/priority-focus-center-store";
import styles from "./priority-focus-center.module.css";

const urgencyLabels = {
  medium: "متوسطة",
  high: "عالية",
  critical: "حرجة",
};

export function PriorityFocusCenter() {
  const state = usePriorityFocusCenterStore();

  const visiblePriorities = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return focusPriorities.filter((item) => {
      const text = [
        item.title,
        item.description,
        item.owner,
        item.impact,
        item.nextAction,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.category === "all" || item.category === state.category) &&
        (state.status === "all" || item.status === state.status) &&
        (!state.criticalOnly || item.urgency === "critical")
      );
    });
  }, [state.category, state.criticalOnly, state.query, state.status]);

  const selectedPriority =
    focusPriorities.find((item) => item.id === state.selectedPriorityId) ??
    visiblePriorities[0] ??
    null;

  const activeCount = focusPriorities.filter(
    (item) => item.status === "active",
  ).length;

  const averageProgress = Math.round(
    focusPriorities.reduce((sum, item) => sum + item.progress, 0) /
      focusPriorities.length,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS ENTERPRISE PRIORITY & FOCUS OS</span>
          <h1>مركز الأولويات والتركيز</h1>
          <p>
            ترتيب ومراقبة الأولويات التنفيذية اليومية مع قياس التقدم
            والمخاطر والإجراءات التالية.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>متوسط الإنجاز</small>
          <strong>{averageProgress}%</strong>
          <span>{activeCount} أولويات نشطة</span>
        </div>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في الأولويات والمالكين والإجراءات"
        />
        <select
          value={state.category}
          onChange={(event) => state.setCategory(event.target.value)}
        >
          <option value="all">كل الفئات</option>
          {Object.entries(focusCategoryLabels).map(([value, label]) => (
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
          {Object.entries(focusStatusLabels).map(([value, label]) => (
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
          الحرجة فقط
        </button>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>EXECUTIVE FOCUS QUEUE</span>
              <h2>قائمة الأولويات</h2>
            </div>
            <strong>{visiblePriorities.length}</strong>
          </div>

          <div className={styles.priorityGrid}>
            {visiblePriorities.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => state.selectPriority(item.id)}
                className={`${styles.priorityCard} ${
                  selectedPriority?.id === item.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{item.id}</span>
                  <span className={styles[item.urgency]}>
                    {urgencyLabels[item.urgency]}
                  </span>
                </div>
                <small>{focusCategoryLabels[item.category]}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className={styles.progress}>
                  <div>
                    <span>التقدم</span>
                    <strong>{item.progress}%</strong>
                  </div>
                  <i>
                    <b style={{ width: `${item.progress}%` }} />
                  </i>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{focusStatusLabels[item.status]}</span>
                  <strong>{item.dueAt}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedPriority && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>FOCUS EXECUTION PROFILE</span>
                  <h2>{selectedPriority.id}</h2>
                </div>
                <span className={styles.badge}>
                  {focusStatusLabels[selectedPriority.status]}
                </span>
              </div>

              <div className={styles.priorityHero}>
                <span>{focusCategoryLabels[selectedPriority.category]}</span>
                <h3>{selectedPriority.title}</h3>
                <p>{selectedPriority.description}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>المالك</dt>
                  <dd>{selectedPriority.owner}</dd>
                </div>
                <div>
                  <dt>الأولوية</dt>
                  <dd>{urgencyLabels[selectedPriority.urgency]}</dd>
                </div>
                <div>
                  <dt>التقدم</dt>
                  <dd>{selectedPriority.progress}%</dd>
                </div>
                <div>
                  <dt>الموعد</dt>
                  <dd>{selectedPriority.dueAt}</dd>
                </div>
              </dl>

              <div className={styles.impactBox}>
                <span>الأثر المتوقع</span>
                <strong>{selectedPriority.impact}</strong>
              </div>

              <div className={styles.actionBox}>
                <span>الإجراء التالي</span>
                <strong>{selectedPriority.nextAction}</strong>
              </div>

              <div className={styles.aiBox}>
                <span>AVOS FOCUS INTELLIGENCE</span>
                <strong>
                  {selectedPriority.status === "blocked"
                    ? "يوصى بتصعيد الاعتماد فوراً لتجنب تأخر التنفيذ."
                    : "الأولوية تسير ضمن النطاق المتوقع مع استمرار المتابعة."}
                </strong>
              </div>

              <div className={styles.actions}>
                <button type="button">بدء التنفيذ</button>
                <button type="button">تحديث التقدم</button>
                <button type="button">إنشاء تصعيد</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
