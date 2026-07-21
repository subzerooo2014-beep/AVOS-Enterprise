'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  RuntimeDashboard,
  RuntimeWorkload,
} from '../../lib/hypervisor-distributed-runtime/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export function HypervisorConsole() {
  const [dashboard, setDashboard] = useState<RuntimeDashboard | null>(null);
  const [command, setCommand] = useState('');
  const [message, setMessage] = useState('Runtime console ready.');

  const refresh = useCallback(async () => {
    try {
      const result = await fetch(
        `${API_BASE}/avos/hypervisor-distributed-runtime/dashboard`,
        { cache: 'no-store' },
      ).then((response) => response.json());

      setDashboard(result);
    } catch {
      setMessage('Unable to load distributed runtime dashboard.');
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  async function executeCommand() {
    if (!command.trim()) return;

    const result = await fetch(
      `${API_BASE}/avos/hypervisor-distributed-runtime/commands`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ command }),
      },
    ).then((response) => response.json());

    setMessage(
      `${result.action}: ${result.status}${
        result.requiresHumanApproval ? ' — Human approval required' : ''
      }`,
    );
    setCommand('');
    await refresh();
  }

  async function runOptimizer() {
    const result = await fetch(
      `${API_BASE}/avos/hypervisor-distributed-runtime/optimizer/run`,
      { method: 'POST' },
    ).then((response) => response.json());

    setMessage(
      result.recommendations
        .map((item: { recommendation: string }) => item.recommendation)
        .join(' | '),
    );
    await refresh();
  }

  async function scale(workload: RuntimeWorkload, change: number) {
    const desiredReplicas = Math.max(0, workload.replicas + change);

    await fetch(
      `${API_BASE}/avos/hypervisor-distributed-runtime/workloads/${encodeURIComponent(
        workload.id,
      )}/scale`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ desiredReplicas }),
      },
    );

    setMessage(`${workload.name} scaled to ${desiredReplicas} replicas.`);
    await refresh();
  }

  async function failover(workload: RuntimeWorkload) {
    const result = await fetch(
      `${API_BASE}/avos/hypervisor-distributed-runtime/workloads/${encodeURIComponent(
        workload.id,
      )}/failover`,
      { method: 'POST' },
    ).then((response) => response.json());

    setMessage(`${workload.name}: ${result.status}`);
    await refresh();
  }

  if (!dashboard) {
    return <main className="hdr-loading">Loading AVOS Hypervisor Runtime…</main>;
  }

  return (
    <main className="hdr-root">
      <header className="hdr-header">
        <div>
          <span>AVOS ENTERPRISE</span>
          <h1>Hypervisor & Distributed Runtime</h1>
          <p>
            Unified control plane for workload orchestration, capacity,
            resilience, observability, security, and AI runtime optimization.
          </p>
        </div>
        <aside>
          <strong>{dashboard.status.healthScore}</strong>
          <span>Runtime Health</span>
          <small>{dashboard.status.status}</small>
        </aside>
      </header>

      <section className="hdr-command">
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="Enter a unified runtime command..."
        />
        <button onClick={executeCommand}>Execute</button>
        <button onClick={runOptimizer}>AI Optimize</button>
        <button onClick={refresh}>Refresh</button>
      </section>

      <p className="hdr-message">{message}</p>

      <section className="hdr-kpis">
        <article>
          <span>Nodes</span>
          <strong>{dashboard.status.nodes}</strong>
          <small>Distributed runtime nodes</small>
        </article>
        <article>
          <span>Workloads</span>
          <strong>{dashboard.status.workloads}</strong>
          <small>Managed capability workloads</small>
        </article>
        <article>
          <span>CPU</span>
          <strong>{dashboard.cluster.cpu.utilizationPercent}%</strong>
          <small>
            {dashboard.cluster.cpu.allocated}/{dashboard.cluster.cpu.total} allocated
          </small>
        </article>
        <article>
          <span>Memory</span>
          <strong>{dashboard.cluster.memory.utilizationPercent}%</strong>
          <small>
            {Math.round(dashboard.cluster.memory.allocatedMb / 1024)} GB allocated
          </small>
        </article>
      </section>

      <section className="hdr-grid">
        <article className="hdr-panel">
          <header>
            <div>
              <span>Cluster Topology</span>
              <h2>Runtime Nodes</h2>
            </div>
            <small>{dashboard.cluster.nodes.length} registered</small>
          </header>

          <div className="hdr-node-list">
            {dashboard.cluster.nodes.map((node) => (
              <article key={node.id}>
                <div>
                  <strong>{node.name}</strong>
                  <span>
                    {node.region} · {node.zone}
                  </span>
                </div>
                <aside>
                  <b>{node.status}</b>
                  <small>
                    CPU {node.cpuAllocated}/{node.cpuCapacity}
                  </small>
                  <small>
                    RAM {Math.round(node.memoryAllocatedMb / 1024)}/
                    {Math.round(node.memoryCapacityMb / 1024)} GB
                  </small>
                </aside>
              </article>
            ))}
          </div>
        </article>

        <article className="hdr-panel">
          <header>
            <div>
              <span>Governance</span>
              <h2>Runtime Policies</h2>
            </div>
            <small>{dashboard.policies.length} enforced</small>
          </header>

          <div className="hdr-policy-list">
            {dashboard.policies.map((policy) => (
              <article key={policy.id}>
                <div>
                  <strong>{policy.name}</strong>
                  <small>{policy.category}</small>
                </div>
                <span>{policy.enforcement}</span>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="hdr-panel hdr-workloads">
        <header>
          <div>
            <span>Orchestration</span>
            <h2>Enterprise Workloads</h2>
          </div>
          <small>Human Final Authority active</small>
        </header>

        <div className="hdr-table">
          <div className="hdr-table-row hdr-table-head">
            <span>Workload</span>
            <span>Node</span>
            <span>Status</span>
            <span>Replicas</span>
            <span>Priority</span>
            <span>Actions</span>
          </div>

          {dashboard.workloads.map((workload) => (
            <div className="hdr-table-row" key={workload.id}>
              <span>
                <strong>{workload.name}</strong>
                <small>{workload.capabilityId}</small>
              </span>
              <span>{workload.nodeId ?? 'Unscheduled'}</span>
              <span className={`hdr-status hdr-status-${workload.status}`}>
                {workload.status}
              </span>
              <span>{workload.replicas}</span>
              <span>{workload.priority}</span>
              <span className="hdr-actions">
                <button onClick={() => scale(workload, 1)}>+ Scale</button>
                <button onClick={() => scale(workload, -1)}>− Scale</button>
                <button onClick={() => failover(workload)}>Failover</button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="hdr-panel hdr-events">
        <header>
          <div>
            <span>Unified Observability</span>
            <h2>Recent Runtime Events</h2>
          </div>
          <small>{dashboard.status.events} retained</small>
        </header>

        <div>
          {dashboard.recentEvents.map((event) => (
            <article key={event.id}>
              <span className={`hdr-severity hdr-${event.severity}`}>
                {event.severity}
              </span>
              <strong>{event.topic}</strong>
              <small>{event.source}</small>
              <time>{new Date(event.timestamp).toLocaleString()}</time>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}