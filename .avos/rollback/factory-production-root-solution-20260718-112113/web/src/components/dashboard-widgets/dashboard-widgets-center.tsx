"use client";

import { useMemo } from "react";
import { dashboardWidgets, widgetCategoryLabels } from "@/data/dashboard-widgets";
import { useDashboardWidgetsStore } from "@/store/dashboard-widgets-store";
import styles from "./dashboard-widgets.module.css";

const statusLabels = {
  healthy: "سليم",
  watch: "مراقبة",
  critical: "حرج",
};

export function DashboardWidgetsCenter() {
  const state = useDashboardWidgetsStore();

  const visibleWidgets = useMemo(
    () =>
      dashboardWidgets.filter(
        (widget) =>
          (state.category === "all" || widget.category === state.category) &&
          (!state.pinnedOnly || widget.pinned),
      ),
    [state.category, state.pinnedOnly],
  );

  const averageHealth = Math.round(
    dashboardWidgets.reduce(
      (sum, widget) =>
        sum + (widget.status === "healthy" ? 100 : widget.status === "watch" ? 75 : 45),
      0,
    ) / dashboardWidgets.length,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS GLOBAL DASHBOARD WIDGETS</span>
          <h1>مركز عناصر لوحة القيادة</h1>
          <p>
            لوحات ذكية قابلة للتخصيص تجمع أهم مؤشرات العمليات والإيرادات
            والجودة والمزودين والذكاء الاصطناعي.
          </p>
        </div>
        <div className={styles.health}>
          <small>صحة المؤشرات</small>
          <strong>{averageHealth}/100</strong>
          <span>{visibleWidgets.length} عناصر ظاهرة</span>
        </div>
      </section>

      <section className={styles.controls}>
        <select value={state.category} onChange={(event) => state.setCategory(event.target.value)}>
          <option value="all">جميع الفئات</option>
          {Object.entries(widgetCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="button" className={state.pinnedOnly ? styles.active : ""} onClick={state.togglePinnedOnly}>
          المثبتة فقط
        </button>
        <button type="button" className={state.compactMode ? styles.active : ""} onClick={state.toggleCompactMode}>
          الوضع المضغوط
        </button>
      </section>

      <section className={`${styles.widgetGrid} ${state.compactMode ? styles.compact : ""}`}>
        {visibleWidgets.map((widget) => (
          <article key={widget.id} className={`${styles.widget} ${styles[widget.size]}`}>
            <div className={styles.topline}>
              <span>{widget.id}</span>
              <span className={styles[widget.status]}>{statusLabels[widget.status]}</span>
            </div>
            <small>{widgetCategoryLabels[widget.category]}</small>
            <h2>{widget.title}</h2>
            <p>{widget.description}</p>
            <div className={styles.metric}>
              <strong>{widget.value}</strong>
              <span className={widget.trend >= 0 ? styles.up : styles.down}>
                {widget.trend >= 0 ? "+" : ""}{widget.trend}%
              </span>
            </div>
            <footer>
              <span>{widget.metric}</span>
              <button type="button">{widget.pinned ? "مثبت" : "تثبيت"}</button>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
