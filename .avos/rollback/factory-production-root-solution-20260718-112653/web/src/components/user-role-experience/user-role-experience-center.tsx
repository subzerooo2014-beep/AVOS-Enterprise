"use client";

import { useMemo } from "react";
import {
  enterpriseUsers,
  userStatusLabels,
} from "@/data/user-role-experience";
import { useUserRoleExperienceStore } from "@/store/user-role-experience-store";
import styles from "./user-role-experience.module.css";

export function UserRoleExperienceCenter() {
  const state = useUserRoleExperienceStore();

  const departments = useMemo(
    () => Array.from(new Set(enterpriseUsers.map((user) => user.department))),
    [],
  );

  const visibleUsers = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return enterpriseUsers.filter((user) => {
      const text = [
        user.name,
        user.email,
        user.role,
        user.department,
        ...user.permissions,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.status === "all" || user.status === state.status) &&
        (state.department === "all" || user.department === state.department) &&
        (!state.mfaOnly || user.mfaEnabled)
      );
    });
  }, [state.department, state.mfaOnly, state.query, state.status]);

  const selectedUser =
    enterpriseUsers.find((user) => user.id === state.selectedUserId) ??
    visibleUsers[0] ??
    null;

  const activeCount = enterpriseUsers.filter(
    (user) => user.status === "active",
  ).length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS USER & ROLE EXPERIENCE</span>
          <h1>مركز المستخدمين والأدوار</h1>
          <p>
            إدارة المستخدمين والصلاحيات وتجربة الوصول مع مراقبة MFA
            وحالة الحساب ومستوى الثقة.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>المستخدمون النشطون</small>
          <strong>{activeCount}</strong>
          <span>من {enterpriseUsers.length}</span>
        </div>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث بالاسم أو البريد أو الدور أو الصلاحية"
        />
        <select
          value={state.status}
          onChange={(event) => state.setStatus(event.target.value)}
        >
          <option value="all">كل الحالات</option>
          {Object.entries(userStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={state.department}
          onChange={(event) => state.setDepartment(event.target.value)}
        >
          <option value="all">كل الأقسام</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={state.mfaOnly ? styles.active : ""}
          onClick={state.toggleMfaOnly}
        >
          MFA فقط
        </button>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.usersPanel}>
          <div className={styles.heading}>
            <div>
              <span>ENTERPRISE USER DIRECTORY</span>
              <h2>دليل المستخدمين</h2>
            </div>
            <strong>{visibleUsers.length}</strong>
          </div>

          <div className={styles.userGrid}>
            {visibleUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => state.selectUser(user.id)}
                className={`${styles.userCard} ${
                  selectedUser?.id === user.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{user.id}</span>
                  <span className={styles[user.status]}>
                    {userStatusLabels[user.status]}
                  </span>
                </div>
                <small>{user.department}</small>
                <h3>{user.name}</h3>
                <p>{user.role}</p>
                <div className={styles.scoreRow}>
                  <span>Access Score</span>
                  <strong>{user.accessScore}%</strong>
                </div>
                <footer>
                  <span>{user.lastActive}</span>
                  <strong>{user.mfaEnabled ? "MFA مفعّل" : "MFA غير مفعّل"}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedUser && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>USER ACCESS PROFILE</span>
                  <h2>{selectedUser.id}</h2>
                </div>
                <span className={styles.badge}>
                  {userStatusLabels[selectedUser.status]}
                </span>
              </div>

              <div className={styles.userHero}>
                <span>{selectedUser.department}</span>
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>الدور</dt>
                  <dd>{selectedUser.role}</dd>
                </div>
                <div>
                  <dt>آخر نشاط</dt>
                  <dd>{selectedUser.lastActive}</dd>
                </div>
                <div>
                  <dt>MFA</dt>
                  <dd>{selectedUser.mfaEnabled ? "مفعّل" : "غير مفعّل"}</dd>
                </div>
                <div>
                  <dt>درجة الوصول</dt>
                  <dd>{selectedUser.accessScore}%</dd>
                </div>
              </dl>

              <div className={styles.permissions}>
                <span>الصلاحيات</span>
                {selectedUser.permissions.map((permission) => (
                  <div key={permission}>
                    <strong>{permission}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.aiBox}>
                <span>AVOS ACCESS INTELLIGENCE</span>
                <strong>
                  {selectedUser.accessScore >= 90
                    ? "الوصول متوازن ومتوافق مع الدور الحالي."
                    : "يوصى بمراجعة الصلاحيات أو استكمال ضوابط الأمان."}
                </strong>
              </div>

              <div className={styles.actions}>
                <button type="button">تعديل الدور</button>
                <button type="button">مراجعة الصلاحيات</button>
                <button type="button">تعليق الحساب</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
