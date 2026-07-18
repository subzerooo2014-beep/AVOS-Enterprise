"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { workspaceActivities, workspaceModules, workspaceNotifications } from "@/data/enterprise-workspace";
import { useEnterpriseWorkspaceStore } from "@/store/enterprise-workspace-store";
import styles from "./enterprise-workspace.module.css";

export function EnterpriseWorkspace() {
  const state = useEnterpriseWorkspaceStore();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        state.toggleCommand();
      }
      if (event.key === "Escape") state.closePanels();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state]);

  const visibleModules = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");
    return workspaceModules.filter((module) => {
      const text = `${module.name} ${module.description} ${module.category}`.toLocaleLowerCase("ar");
      return (!query || text.includes(query)) && (!state.favoritesOnly || module.favorite);
    });
  }, [state.favoritesOnly, state.query]);

  const recentModules = [...workspaceModules].sort((a, b) => a.recentRank - b.recentRank).slice(0, 4);
  const favorites = workspaceModules.filter((module) => module.favorite);
  const unread = workspaceNotifications.filter((item) => item.unread).length;

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}><span>AVOS</span><strong>Enterprise OS</strong></div>
        <nav>
          {workspaceModules.map((module) => (
            <Link key={module.id} href={module.route}>
              <span>◈</span><div><strong>{module.name}</strong><small>{module.category}</small></div>
            </Link>
          ))}
        </nav>
        <div className={styles.health}><span>Platform Health</span><strong>Healthy · 98%</strong></div>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <div><span>AVOS WEB PLATFORM V3</span><h1>مساحة العمل المؤسسية</h1></div>
          <div className={styles.headerActions}>
            <button type="button" onClick={state.toggleCommand}>البحث والأوامر <kbd>Ctrl K</kbd></button>
            <button type="button" onClick={state.toggleActivity}>النشاط</button>
            <button type="button" onClick={state.toggleNotifications}>الإشعارات <b>{unread}</b></button>
          </div>
        </header>

        <section className={styles.search}>
          <input value={state.query} onChange={(event) => state.setQuery(event.target.value)} placeholder="ابحث في الأنظمة والإجراءات" />
          <button type="button" onClick={state.toggleFavorites} className={state.favoritesOnly ? styles.active : ""}>المفضلة فقط</button>
        </section>

        <section className={styles.quickActions}>
          <button type="button">+ طلب خدمة</button>
          <button type="button">+ إضافة مزود</button>
          <button type="button">تشغيل تحليل AVOS</button>
          <button type="button">فتح التصعيدات</button>
        </section>

        <section className={styles.grid}>
          <div className={styles.panel}>
            <div className={styles.heading}><div><span>UNIFIED MODULE ACCESS</span><h2>جميع الوحدات</h2></div><strong>{visibleModules.length}</strong></div>
            <div className={styles.moduleGrid}>
              {visibleModules.map((module) => (
                <Link href={module.route} key={module.id} className={styles.card}>
                  <span className={styles.icon}>◈</span>
                  <div><h3>{module.name} {module.favorite ? "★" : ""}</h3><p>{module.description}</p><small>{module.category}</small></div>
                </Link>
              ))}
            </div>
          </div>

          <aside className={styles.rail}>
            <div className={styles.panel}><div className={styles.heading}><div><span>FAVORITES</span><h2>المفضلة</h2></div></div>{favorites.map((m) => <Link key={m.id} href={m.route}>{m.name}</Link>)}</div>
            <div className={styles.panel}><div className={styles.heading}><div><span>RECENT</span><h2>المستخدمة مؤخراً</h2></div></div>{recentModules.map((m) => <Link key={m.id} href={m.route}>{m.name}</Link>)}</div>
          </aside>
        </section>
      </section>

      {state.commandOpen && (
        <div className={styles.overlay} onClick={state.closePanels}>
          <div className={styles.command} onClick={(e) => e.stopPropagation()}>
            <input autoFocus value={state.query} onChange={(event) => state.setQuery(event.target.value)} placeholder="اكتب اسم النظام أو الإجراء..." />
            {visibleModules.map((module) => <Link key={module.id} href={module.route} onClick={state.closePanels}><strong>{module.name}</strong><small>{module.description}</small></Link>)}
          </div>
        </div>
      )}

      {(state.notificationsOpen || state.activityOpen) && (
        <aside className={styles.drawer}>
          <button type="button" onClick={state.closePanels}>×</button>
          <h2>{state.notificationsOpen ? "مركز الإشعارات" : "سجل النشاط"}</h2>
          {state.notificationsOpen
            ? workspaceNotifications.map((item) => <article key={item.id} className={styles[item.type]}><strong>{item.title}</strong><p>{item.description}</p></article>)
            : workspaceActivities.map((item) => <article key={item.id}><strong>{item.actor}</strong><p>{item.action} · {item.target}</p><small>{item.createdAt}</small></article>)}
        </aside>
      )}
    </main>
  );
}
