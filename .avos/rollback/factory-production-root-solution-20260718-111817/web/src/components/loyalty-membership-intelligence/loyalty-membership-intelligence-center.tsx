"use client";

import { useMemo } from "react";
import {
  loyaltyMembers,
  loyaltyStatusLabels,
  loyaltyTierLabels,
} from "@/data/loyalty-membership-intelligence";
import { useLoyaltyMembershipIntelligenceStore } from "@/store/loyalty-membership-intelligence-store";
import styles from "./loyalty-membership-intelligence.module.css";

function money(value: number) {
  return new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function LoyaltyMembershipIntelligenceCenter() {
  const state = useLoyaltyMembershipIntelligenceStore();

  const visibleMembers = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return loyaltyMembers.filter((member) => {
      const text = [
        member.name,
        member.owner,
        member.recommendation,
        ...member.nextBestActions,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.tier === "all" || member.tier === state.tier) &&
        (state.status === "all" || member.status === state.status) &&
        (!state.upgradeReadyOnly || member.upgradeProbability >= 60)
      );
    });
  }, [state.query, state.status, state.tier, state.upgradeReadyOnly]);

  const selectedMember =
    loyaltyMembers.find((member) => member.id === state.selectedMemberId) ??
    visibleMembers[0] ??
    null;

  const totalSpend = loyaltyMembers.reduce(
    (sum, member) => sum + member.annualSpend,
    0,
  );

  const averageRetention = Math.round(
    loyaltyMembers.reduce((sum, member) => sum + member.retentionScore, 0) /
      loyaltyMembers.length,
  );

  const upgradeReadyCount = loyaltyMembers.filter(
    (member) => member.upgradeProbability >= 60,
  ).length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS LOYALTY & MEMBERSHIP INTELLIGENCE</span>
          <h1>مركز الولاء والعضويات الذكية</h1>
          <p>
            إدارة مستويات العضوية والنقاط والمزايا وفرص الترقية
            والاحتفاظ بالعملاء من مركز واحد.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>الإنفاق السنوي</small>
          <strong>{money(totalSpend)}</strong>
          <span>{upgradeReadyCount} أعضاء جاهزون للترقية</span>
        </div>
      </section>

      <section className={styles.kpis}>
        <article>
          <span>متوسط الاحتفاظ</span>
          <strong>{averageRetention}%</strong>
          <small>جميع المستويات</small>
        </article>
        <article>
          <span>Elite</span>
          <strong>{loyaltyMembers.filter((m) => m.tier === "elite").length}</strong>
          <small>أعلى مستوى</small>
        </article>
        <article>
          <span>جاهزون للترقية</span>
          <strong>{upgradeReadyCount}</strong>
          <small>احتمال 60%+</small>
        </article>
        <article>
          <span>قرب الانتهاء</span>
          <strong>{loyaltyMembers.filter((m) => m.status === "expiring").length}</strong>
          <small>تدخل مطلوب</small>
        </article>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في الأعضاء والتوصيات والمزايا"
        />
        <select
          value={state.tier}
          onChange={(event) => state.setTier(event.target.value)}
        >
          <option value="all">كل المستويات</option>
          {Object.entries(loyaltyTierLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={state.status}
          onChange={(event) => state.setStatus(event.target.value)}
        >
          <option value="all">كل الحالات</option>
          {Object.entries(loyaltyStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          type="button"
          className={state.upgradeReadyOnly ? styles.active : ""}
          onClick={state.toggleUpgradeReadyOnly}
        >
          جاهزون للترقية
        </button>
        <button type="button" onClick={state.reset}>إعادة الضبط</button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>LOYALTY MEMBER MATRIX</span>
              <h2>الأعضاء والعضويات</h2>
            </div>
            <strong>{visibleMembers.length}</strong>
          </div>

          <div className={styles.memberGrid}>
            {visibleMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => state.selectMember(member.id)}
                className={`${styles.memberCard} ${
                  selectedMember?.id === member.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{member.id}</span>
                  <span className={styles[member.tier]}>
                    {loyaltyTierLabels[member.tier]}
                  </span>
                </div>
                <small>{member.owner}</small>
                <h3>{member.name}</h3>
                <p>{member.lastActivity}</p>
                <div className={styles.metrics}>
                  <div>
                    <span>النقاط</span>
                    <strong>{member.points.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span>الإنفاق</span>
                    <strong>{money(member.annualSpend)}</strong>
                  </div>
                  <div>
                    <span>الزيارات</span>
                    <strong>{member.visits}</strong>
                  </div>
                </div>
                <div className={styles.progress}>
                  <div>
                    <span>احتمال الترقية</span>
                    <strong>{member.upgradeProbability}%</strong>
                  </div>
                  <i>
                    <b style={{ width: `${member.upgradeProbability}%` }} />
                  </i>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{loyaltyStatusLabels[member.status]}</span>
                  <strong>Retention {member.retentionScore}%</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedMember && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>MEMBERSHIP VALUE PROFILE</span>
                  <h2>{selectedMember.id}</h2>
                </div>
                <span className={styles.badge}>
                  {loyaltyTierLabels[selectedMember.tier]}
                </span>
              </div>

              <div className={styles.memberHero}>
                <span>{selectedMember.owner}</span>
                <h3>{selectedMember.name}</h3>
                <p>{loyaltyStatusLabels[selectedMember.status]}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>النقاط</dt>
                  <dd>{selectedMember.points.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>الإنفاق السنوي</dt>
                  <dd>{money(selectedMember.annualSpend)}</dd>
                </div>
                <div>
                  <dt>المزايا المستخدمة</dt>
                  <dd>{selectedMember.benefitsUsed}</dd>
                </div>
                <div>
                  <dt>درجة الاحتفاظ</dt>
                  <dd>{selectedMember.retentionScore}%</dd>
                </div>
              </dl>

              <div className={styles.actionsBox}>
                <span>أفضل الإجراءات التالية</span>
                {selectedMember.nextBestActions.map((action) => (
                  <strong key={action}>{action}</strong>
                ))}
              </div>

              <div className={styles.aiBox}>
                <span>AVOS LOYALTY INTELLIGENCE</span>
                <strong>{selectedMember.recommendation}</strong>
              </div>

              <div className={styles.actions}>
                <button type="button">ترقية العضوية</button>
                <button type="button">إضافة نقاط</button>
                <button type="button">تشغيل حملة ولاء</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
