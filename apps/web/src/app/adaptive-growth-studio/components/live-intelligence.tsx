import type { AgsLiveIntelligence } from "../lib/live-types";
import styles from "./live-intelligence.module.css";

export function LiveIntelligence({
  data,
}: {
  data: AgsLiveIntelligence;
}) {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div>
          <span>Real Intelligence Wiring</span>
          <h2>Live enterprise signals</h2>
        </div>
        <div className={styles.freshness}>
          <strong>{data.status}</strong>
          <small>
            Updated {new Date(data.freshness.generatedAt).toLocaleTimeString()}
          </small>
        </div>
      </div>

      <div className={styles.sources}>
        {data.sources.map((source) => (
          <article key={source.source}>
            <div>
              <strong>{source.source}</strong>
              <span>{source.endpoint}</span>
            </div>
            <small data-status={source.status}>
              {source.status} · {source.latencyMs}ms
            </small>
          </article>
        ))}
      </div>

      <div className={styles.metrics}>
        {data.metrics.map((metric) => (
          <article key={metric.id}>
            <span>{metric.title}</span>
            <strong>{metric.value}</strong>
            <small>{metric.source}</small>
          </article>
        ))}
      </div>

      <div className={styles.grid}>
        <article className={styles.panel}>
          <span>Knowledge Fabric</span>
          <h3>Connected knowledge</h3>
          <dl>
            <div><dt>Documents</dt><dd>{data.knowledge.documents}</dd></div>
            <div><dt>Entities</dt><dd>{data.knowledge.entities}</dd></div>
            <div><dt>Relationships</dt><dd>{data.knowledge.relationships}</dd></div>
            <div><dt>Confidence</dt><dd>{data.knowledge.confidence}</dd></div>
          </dl>
        </article>

        <article className={styles.panel}>
          <span>Capability Fabric</span>
          <h3>Runtime readiness</h3>
          <dl>
            <div><dt>Total</dt><dd>{data.capabilities.total}</dd></div>
            <div><dt>Healthy</dt><dd>{data.capabilities.healthy}</dd></div>
            <div><dt>Degraded</dt><dd>{data.capabilities.degraded}</dd></div>
            <div><dt>Readiness</dt><dd>{data.capabilities.readinessScore}</dd></div>
          </dl>
        </article>

        <article className={styles.panel}>
          <span>Adaptive Growth Engine</span>
          <h3>Recommendations</h3>
          <ul>
            {data.recommendations.length ? (
              data.recommendations.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <small>
                    Confidence {item.confidence} · {item.impact}
                  </small>
                </li>
              ))
            ) : (
              <li>No live recommendations available.</li>
            )}
          </ul>
        </article>

        <article className={styles.panel}>
          <span>Adaptive Growth Platform</span>
          <h3>Opportunities</h3>
          <ul>
            {data.opportunities.length ? (
              data.opportunities.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <small>
                    Score {item.score} · Confidence {item.confidence}
                  </small>
                </li>
              ))
            ) : (
              <li>No live opportunities available.</li>
            )}
          </ul>
        </article>
      </div>
    </section>
  );
}