"use client";

import { useMemo } from "react";
import {
  serviceDomainLabels,
  serviceHealthRecords,
  serviceStatusLabels,
} from "@/data/service-health-observability";
import { useServiceHealthObservabilityStore } from "@/store/service-health-observability-store";
import styles from "./service-health-observability.module.css";

export function ServiceHealthObservabilityCenter() {
  const state = useServiceHealthObservabilityStore();

  const visibleServices = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase("ar");

    return serviceHealthRecords.filter((service) => {
      const text = [
        service.name,
        service.owner,
        service.recommendation,
        ...service.dependencies,
      ]
        .join(" ")
        .toLocaleLowerCase("ar");

      return (
        (!query || text.includes(query)) &&
        (state.domain === "all" || service.domain === state.domain) &&
        (state.status === "all" || service.status === state.status) &&
        (!state.unhealthyOnly || service.status !== "healthy")
      );
    });
  }, [state.domain, state.query, state.status, state.unhealthyOnly]);

  const selectedService =
    serviceHealthRecords.find(
      (service) => service.id === state.selectedServiceId,
    ) ??
    visibleServices[0] ??
    null;

  const healthyCount = serviceHealthRecords.filter(
    (service) => service.status === "healthy",
  ).length;

  const averageUptime =
    serviceHealthRecords.reduce((sum, service) => sum + service.uptime, 0) /
    serviceHealthRecords.length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>AVOS ENTERPRISE SERVICE HEALTH & OBSERVABILITY</span>
          <h1>مركز صحة الخدمات والمراقبة</h1>
          <p>
            مراقبة موحدة للتوفر والأداء والأخطاء والاعتماديات مع توصيات
            تشغيلية ذكية.
          </p>
        </div>
        <div className={styles.heroCard}>
          <small>متوسط التوفر</small>
          <strong>{averageUptime.toFixed(2)}%</strong>
          <span>{healthyCount} خدمات سليمة</span>
        </div>
      </section>

      <section className={styles.controls}>
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="ابحث في الخدمات والمالكين والاعتماديات"
        />
        <select
          value={state.domain}
          onChange={(event) => state.setDomain(event.target.value)}
        >
          <option value="all">كل المجالات</option>
          {Object.entries(serviceDomainLabels).map(([value, label]) => (
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
          {Object.entries(serviceStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={state.unhealthyOnly ? styles.active : ""}
          onClick={state.toggleUnhealthyOnly}
        >
          غير السليمة فقط
        </button>
        <button type="button" onClick={state.reset}>
          إعادة الضبط
        </button>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listPanel}>
          <div className={styles.heading}>
            <div>
              <span>SERVICE HEALTH MATRIX</span>
              <h2>الخدمات المراقبة</h2>
            </div>
            <strong>{visibleServices.length}</strong>
          </div>

          <div className={styles.serviceGrid}>
            {visibleServices.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => state.selectService(service.id)}
                className={`${styles.serviceCard} ${
                  selectedService?.id === service.id ? styles.selected : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <span>{service.id}</span>
                  <span className={styles[service.status]}>
                    {serviceStatusLabels[service.status]}
                  </span>
                </div>
                <small>{serviceDomainLabels[service.domain]}</small>
                <h3>{service.name}</h3>
                <p>{service.owner}</p>
                <div className={styles.metrics}>
                  <div>
                    <span>Uptime</span>
                    <strong>{service.uptime}%</strong>
                  </div>
                  <div>
                    <span>Latency</span>
                    <strong>{service.latencyMs}ms</strong>
                  </div>
                  <div>
                    <span>Error Rate</span>
                    <strong>{service.errorRate}%</strong>
                  </div>
                </div>
                <footer className={styles.cardFooter}>
                  <span>{service.requestsPerMinute} طلب/دقيقة</span>
                  <strong>{service.lastIncident}</strong>
                </footer>
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          {selectedService && (
            <>
              <div className={styles.heading}>
                <div>
                  <span>OBSERVABILITY PROFILE</span>
                  <h2>{selectedService.id}</h2>
                </div>
                <span className={styles.badge}>
                  {serviceStatusLabels[selectedService.status]}
                </span>
              </div>

              <div className={styles.serviceHero}>
                <span>{serviceDomainLabels[selectedService.domain]}</span>
                <h3>{selectedService.name}</h3>
                <p>{selectedService.owner}</p>
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>التوفر</dt>
                  <dd>{selectedService.uptime}%</dd>
                </div>
                <div>
                  <dt>زمن الاستجابة</dt>
                  <dd>{selectedService.latencyMs}ms</dd>
                </div>
                <div>
                  <dt>معدل الأخطاء</dt>
                  <dd>{selectedService.errorRate}%</dd>
                </div>
                <div>
                  <dt>الطلبات</dt>
                  <dd>{selectedService.requestsPerMinute}/د</dd>
                </div>
              </dl>

              <div className={styles.dependenciesBox}>
                <span>الاعتماديات</span>
                {selectedService.dependencies.map((dependency) => (
                  <strong key={dependency}>{dependency}</strong>
                ))}
              </div>

              <div className={styles.aiBox}>
                <span>AVOS OBSERVABILITY INTELLIGENCE</span>
                <strong>{selectedService.recommendation}</strong>
              </div>

              <div className={styles.actions}>
                <button type="button">فتح Dashboard</button>
                <button type="button">إنشاء تنبيه</button>
                <button type="button">فتح Incident</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
