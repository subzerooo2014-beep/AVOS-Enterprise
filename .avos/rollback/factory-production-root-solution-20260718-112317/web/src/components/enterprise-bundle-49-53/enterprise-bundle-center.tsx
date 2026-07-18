"use client";

import { useMemo, useState } from "react";
import { enterpriseBundleCenters, type EnterpriseCenterKey } from "@/data/enterprise-bundle-49-53";
import styles from "./enterprise-bundle-center.module.css";

type Props = { center: EnterpriseCenterKey };
const statusLabels = { healthy: "سليم", watch: "مراقبة", critical: "حرج", opportunity: "فرصة" };

export function EnterpriseBundleCenter({ center }: Props) {
  const config = enterpriseBundleCenters[center];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ar");
    return config.records.filter((record) => {
      const text = [record.title, record.owner, record.summary, record.impact, record.action].join(" ").toLocaleLowerCase("ar");
      return (!normalized || text.includes(normalized)) && (status === "all" || record.status === status);
    });
  }, [config.records, query, status]);
  const selected = config.records.find((record) => record.id === selectedId) ?? visibleRecords[0] ?? null;

  return <main className={styles.page}>
    <section className={styles.hero}><div><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.description}</p></div><div className={styles.heroCard}><small>{config.heroLabel}</small><strong>{config.heroValue}</strong><span>AVOS Enterprise Intelligence</span></div></section>
    <section className={styles.metrics}>{config.metrics.map((metric) => <article key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></article>)}</section>
    <section className={styles.controls}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث في السجلات والتوصيات"/><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">كل الحالات</option>{Object.entries(statusLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><button type="button" onClick={() => { setQuery(""); setStatus("all"); }}>إعادة الضبط</button></section>
    <section className={styles.workspace}><div className={styles.listPanel}><div className={styles.heading}><div><span>ENTERPRISE EXECUTION MATRIX</span><h2>لوحة التنفيذ الذكية</h2></div><strong>{visibleRecords.length}</strong></div><div className={styles.recordGrid}>{visibleRecords.map((record) => <button key={record.id} type="button" onClick={() => setSelectedId(record.id)} className={`${styles.recordCard} ${selected?.id === record.id ? styles.selected : ""}`}><div className={styles.cardTop}><span>{record.id}</span><span className={styles[record.status]}>{statusLabels[record.status]}</span></div><small>{record.owner}</small><h3>{record.title}</h3><p>{record.summary}</p><div className={styles.score}><div><span>درجة الجاهزية</span><strong>{record.score}%</strong></div><i><b style={{ width: `${record.score}%` }}/></i></div><footer className={styles.cardFooter}><span>{record.impact}</span><strong>{record.action}</strong></footer></button>)}</div></div>
      <aside className={styles.detailPanel}>{selected && <><div className={styles.heading}><div><span>EXECUTIVE PROFILE</span><h2>{selected.id}</h2></div><span className={styles.badge}>{statusLabels[selected.status]}</span></div><div className={styles.detailHero}><span>{selected.owner}</span><h3>{selected.title}</h3><p>{selected.summary}</p></div><div className={styles.impactBox}><span>الأثر المتوقع</span><strong>{selected.impact}</strong></div><div className={styles.actionBox}><span>الإجراء المقترح</span><strong>{selected.action}</strong></div><div className={styles.aiBox}><span>AVOS ENTERPRISE INTELLIGENCE</span><strong>{config.intelligence}</strong></div><div className={styles.actions}><button type="button">{config.primaryAction}</button><button type="button">تشغيل المحاكاة</button><button type="button">إنشاء قرار تنفيذي</button></div></>}</aside>
    </section>
  </main>;
}
