"use client";

import { useMemo } from "react";
import {
  customerSegmentLabels,
  customerValueRecords,
} from "@/data/customer-value-retention";
import { useCustomerValueRetentionStore } from "@/store/customer-value-retention-store";
import styles from "./customer-value-retention.module.css";

function money(value: number) {
  return new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CustomerValueRetentionCenter() {
  const state = useCustomerValueRetentionStore();

  const visibleCustomers = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return customerValueRecords.filter((customer) => {
      const text = [
        customer.name,
        customer.owner,
        customer.recommendation,
        ...customer.nextBestActions,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.segment === "all" || customer.segment === state.segment) &&
        (!state.highRiskOnly || customer.churnRisk >= 50)
      );
    });
  }, [state.highRiskOnly, state.query, state.segment]);

  const selectedCustomer =
    customerValueRecords.find(
      (customer) => customer.id === state.selectedCustomerId,
    ) ??
    visibleCustomers[0] ??
    null;

  const totalLifetimeValue = customerValueRecords.reduce(
    (sum, customer) => sum + customer.lifetimeValue,
    0,
  );

  const averageRetention = Math.round(
    customerValueRecords.reduce(
      (sum, customer) => sum + customer.retentionScore,
      0,
    ) / customerValueRecords.length,
  );

  const highRiskCount = customerValueRecords.filter(
    (customer) => customer.churnRisk >= 50,
  ).length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS CUSTOMER VALUE & RETENTION INTELLIGENCE</span>
          <h1>مركز قيمة العميل والاحتفاظ</h1>
          <p>
            تحليل قيمة العملاء ومخاطر الفقد والرضا وفرص النمو مع توصيات
            ذكية للحفاظ على العملاء وزيادة الإيراد.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>القيمة الإجمالية</small>
          <strong>{money(totalLifetimeValue)}</strong>
          <span>{highRiskCount} عملاء تحت الخطر</span>
        </div>
      </section>

      <section className={styles.kpis}>
        <article>
          <span>متوسط الاحتفاظ</span>
          <strong>{averageRetention}%</strong>
          <small>جميع الشرائح</small>
        </article>
        <article>
          <span>عملاء VIP</span>
          <strong>{customerValueRecords.filter((c) => c.segment === "vip").length}</strong>
          <small>عناية خاصة</small>
        </article>
        <article>
          <span>مرتفعو القيمة</span>
          <strong>{customerValueRecords.filter((c) => c.segment === "high_value").length}</strong>
          <small>فرص توسع</small>
        </article>
        <article>
          <span>معرضون للفقد</span>
          <strong>{highRiskCount}</strong>
          <small>تدخل فوري</small>
        </article>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في العملاء والمالكين والتوصيات"
        />
        <select
          value={state.segment}
          onChange={(event) => state.setSegment(event.target.value)}
        >
          <option value="all">كل الشرائح</option>
          {Object.entries(customerSegmentLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          type="button"
          className={state.highRiskOnly ? styles.active : ""}
          onClick={state.toggleHighRiskOnly}
        >
          مخاطر فقد 50%+
        </button>
        <button type="button" onClick={state.reset}>إعادة الضبط</button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>CUSTOMER VALUE MATRIX</span>
              <h2>شرائح العملاء</h2>
            </div>
            <strong>{visibleCustomers.length}</strong>
          </div>

          <div className={styles.customerGrid}>
            {visibleCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => state.selectCustomer(customer.id)}
                className={`${styles.customerCard} ${
                  selectedCustomer?.id === customer.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{customer.id}</span>
                  <span className={styles[customer.segment]}>
                    {customerSegmentLabels[customer.segment]}
                  </span>
                </div>
                <small>{customer.owner}</small>
                <h3>{customer.name}</h3>
                <p>{customer.lastActivity}</p>
                <div className={styles.metrics}>
                  <div>
                    <span>LTV</span>
                    <strong>{money(customer.lifetimeValue)}</strong>
                  </div>
                  <div>
                    <span>Retention</span>
                    <strong>{customer.retentionScore}%</strong>
                  </div>
                  <div>
                    <span>Churn Risk</span>
                    <strong>{customer.churnRisk}%</strong>
                  </div>
                </div>
                <div className={styles.progress}>
                  <div>
                    <span>رضا العميل</span>
                    <strong>{customer.satisfactionScore}%</strong>
                  </div>
                  <i>
                    <b style={{ width: `${customer.satisfactionScore}%` }} />
                  </i>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{customer.servicesUsed} خدمات</span>
                  <strong>{money(customer.monthlyRevenue)}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedCustomer && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>CUSTOMER VALUE PROFILE</span>
                  <h2>{selectedCustomer.id}</h2>
                </div>
                <span className={styles.badge}>
                  {customerSegmentLabels[selectedCustomer.segment]}
                </span>
              </div>

              <div className={styles.customerHero}>
                <span>{selectedCustomer.owner}</span>
                <h3>{selectedCustomer.name}</h3>
                <p>{selectedCustomer.lastActivity}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>قيمة العميل</dt>
                  <dd>{money(selectedCustomer.lifetimeValue)}</dd>
                </div>
                <div>
                  <dt>الإيراد الشهري</dt>
                  <dd>{money(selectedCustomer.monthlyRevenue)}</dd>
                </div>
                <div>
                  <dt>درجة الاحتفاظ</dt>
                  <dd>{selectedCustomer.retentionScore}%</dd>
                </div>
                <div>
                  <dt>مخاطر الفقد</dt>
                  <dd>{selectedCustomer.churnRisk}%</dd>
                </div>
              </dl>

              <div className={styles.actionsBox}>
                <span>أفضل الإجراءات التالية</span>
                {selectedCustomer.nextBestActions.map((action) => (
                  <strong key={action}>{action}</strong>
                ))}
              </div>

              <div className={styles.aiBox}>
                <span>AVOS RETENTION INTELLIGENCE</span>
                <strong>{selectedCustomer.recommendation}</strong>
              </div>

              <div className={styles.actions}>
                <button type="button">تشغيل خطة الاحتفاظ</button>
                <button type="button">إنشاء عرض مخصص</button>
                <button type="button">فتح حالة استرداد</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
