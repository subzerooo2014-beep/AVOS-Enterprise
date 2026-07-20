"use client";
import { useMemo, useState } from "react";
import type { AgsBootstrap } from "./lib/types";
import styles from "./studio.module.css";

export function StudioShell({ data }: { data: AgsBootstrap }) {
  const [active, setActive] = useState(data.navigation[0]?.id ?? "executive-growth-dashboard");
  const [query, setQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const current = data.navigation.find((item) => item.id === active);
  const sections = useMemo(() => data.navigation.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [data.navigation, query]);

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}><b>AV</b><div><strong>Adaptive Growth Studio</strong><span>{data.studio.version}</span></div></div>
        <button className={styles.command} onClick={() => setCommandOpen(true)}>Command Palette <kbd>Ctrl K</kbd></button>
        <input className={styles.search} placeholder="Search 25 sections..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <nav>{sections.map((item) => <button key={item.id} className={active === item.id ? styles.active : ""} onClick={() => setActive(item.id)}>{item.name}</button>)}</nav>
      </aside>

      <section className={styles.content}>
        <header><div><small>{data.tenant.name}</small><h1>{current?.name}</h1></div><div className={styles.identity}><span>{data.workspace.name}</span><b>{data.user.name}</b></div></header>
        <section className={styles.hero}><div><span>{data.studio.status}</span><h2>Enterprise growth command center</h2><p>Intelligence, strategy, experimentation, execution, governance, and revenue in one workspace.</p></div><strong>{data.studio.score}</strong></section>
        <section className={styles.metrics}>{data.metrics.map((metric) => <article key={metric.id}><span>{metric.title}</span><strong>{metric.value}</strong><small>+{metric.trend}%</small></article>)}</section>
        <section className={styles.grid}>
          <article className={styles.wide}><h3>Portfolio Performance</h3><div className={styles.chart}>{[58,72,64,81,76,92,88,100].map((height, index) => <i key={index} style={{height: `${height}%`}} />)}</div></article>
          <article><h3>AI Recommended Actions</h3><ul><li>Increase experiment budget</li><li>Launch pricing scenario B</li><li>Prioritize enterprise segment</li></ul></article>
          <article><h3>Top Opportunities</h3><p>Enterprise expansion <b>94</b></p><p>Premium pricing <b>91</b></p><p>Retention automation <b>87</b></p></article>
          <article className={styles.wide}><h3>Live Execution Timeline</h3><p>Scenario simulation completed</p><p>Growth strategy awaiting human approval</p><p>Revenue forecast refreshed</p></article>
        </section>
      </section>

      {commandOpen && <div className={styles.overlay} onClick={() => setCommandOpen(false)}><div className={styles.modal} onClick={(e) => e.stopPropagation()}><input autoFocus placeholder="Ask AVOS to analyze, plan, or execute..." /><button>Analyze growth opportunity</button><button>Create experiment</button><button>Generate executive briefing</button></div></div>}
    </main>
  );
}