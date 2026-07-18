"use client";

import { useMemo } from "react";
import { enterpriseSettings, settingCategoryLabels } from "@/data/enterprise-settings";
import { useEnterpriseSettingsStore } from "@/store/enterprise-settings-store";
import styles from "./enterprise-settings.module.css";

export function EnterpriseSettingsCenter() {
  const state = useEnterpriseSettingsStore();

  const visibleSettings = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");
    return enterpriseSettings.filter((item) => {
      const text = `${item.title} ${item.description} ${item.value}`.toLocaleLowerCase("ar");
      return (!query || text.includes(query)) &&
        (state.category === "all" || item.category === state.category);
    });
  }, [state.category, state.query]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS ENTERPRISE SETTINGS</span>
          <h1>مركز الإعدادات المؤسسية</h1>
          <p>إدارة إعدادات المؤسسة والأمان والإشعارات والمظهر والذكاء الاصطناعي من مكان واحد.</p>
        </div>
        <div className={styles.summary}>
          <small>الإعدادات النشطة</small>
          <strong>{enterpriseSettings.filter((item) => item.enabled).length}</strong>
          <span>من {enterpriseSettings.length}</span>
        </div>
      </section>

      <section className={styles.controls}>
        <input value={state.query} onChange={(e) => state.setQuery(e.target.value)} placeholder="ابحث في الإعدادات" />
        <select value={state.category} onChange={(e) => state.setCategory(e.target.value)}>
          <option value="all">كل الفئات</option>
          {Object.entries(settingCategoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button type="button" onClick={state.reset}>إعادة الضبط</button>
      </section>

      <section className={styles.grid}>
        {visibleSettings.map((item) => (
          <article key={item.id}>
            <div className={styles.topline}>
              <span>{item.id}</span>
              <b className={item.enabled ? styles.enabled : styles.disabled}>{item.enabled ? "مفعّل" : "متوقف"}</b>
            </div>
            <small>{settingCategoryLabels[item.category]}</small>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <footer>
              <strong>{item.value}</strong>
              <button type="button">{item.enabled ? "تعديل" : "تفعيل"}</button>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
