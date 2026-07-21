'use client';

import { useCallback, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type Dashboard = {
  status: any;
  cloudNodes: any[];
  teams: any[];
  genesisProjects: any[];
  recentEvents: any[];
};

export function EnterpriseEvolutionConsole() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [message, setMessage] = useState('Enterprise Evolution console ready.');

  const refresh = useCallback(async () => {
    try {
      const result = await fetch(
        `${API_BASE}/avos/enterprise-evolution/dashboard`,
        { cache: 'no-store' },
      ).then((response) => response.json());
      setDashboard(result);
    } catch {
      setMessage('Unable to load Enterprise Evolution dashboard.');
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  async function createGenesisDemo() {
    const project = await fetch(
      `${API_BASE}/avos/enterprise-evolution/genesis/projects`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: `AVOS Genesis Project ${Date.now()}`,
          type: 'platform',
          objective:
            'Generate a globally compliant AI-first digital platform using AVOS capabilities.',
        }),
      },
    ).then((response) => response.json());

    setMessage(
      `Genesis project ${project.name} created and awaits Human Final Authority approval.`,
    );
    await refresh();
  }

  async function dispatchMission() {
    const result = await fetch(
      `${API_BASE}/avos/enterprise-evolution/organization/missions`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mission:
            'Analyze AVOS Enterprise Cloud readiness and propose the next strategic improvement.',
          teamId: 'team-executive',
          strategic: true,
        }),
      },
    ).then((response) => response.json());

    setMessage(
      `${result.team.name}: ${result.status}. Human approval: ${result.requiresHumanApproval}.`,
    );
    await refresh();
  }

  if (!dashboard) {
    return <main className="ee-loading">Loading AVOS Enterprise Evolution...</main>;
  }

  const status = dashboard.status;

  return (
    <main className="ee-root">
      <header className="ee-hero">
        <div>
          <span>AVOS ENTERPRISE</span>
          <h1>Enterprise Evolution Platform</h1>
          <p>
            Enterprise Cloud, Autonomous AI Organization, and Genesis Engine
            unified under Human Final Authority.
          </p>
        </div>
        <aside>
          <strong>{status.healthScore}</strong>
          <span>Health</span>
          <small>{status.status}</small>
        </aside>
      </header>

      <section className="ee-actions">
        <button onClick={refresh}>Refresh</button>
        <button onClick={dispatchMission}>Dispatch AI Mission</button>
        <button onClick={createGenesisDemo}>Create Genesis Project</button>
      </section>

      <p className="ee-message">{message}</p>

      <section className="ee-pillars">
        <article>
          <span>Mega Pack 101-150</span>
          <h2>Enterprise Cloud</h2>
          <strong>{status.enterpriseCloud.status}</strong>
          <p>
            Kubernetes, Docker, multi-node, multi-region, hybrid cloud,
            resilience, observability, and Infrastructure as Code.
          </p>
          <b>{status.enterpriseCloud.nodes} nodes</b>
        </article>

        <article>
          <span>Mega Pack 151-200</span>
          <h2>Autonomous AI Organization</h2>
          <strong>{status.autonomousAIOrganization.status}</strong>
          <p>
            Specialist AI teams, shared memory, Living Vision, team
            orchestration, evidence, trust, and governed autonomy.
          </p>
          <b>
            {status.autonomousAIOrganization.teams} teams /{' '}
            {status.autonomousAIOrganization.agents} agents
          </b>
        </article>

        <article>
          <span>Mega Pack 201-300</span>
          <h2>Genesis Engine</h2>
          <strong>{status.genesisEngine.status}</strong>
          <p>
            Generates platform, application, and digital-business blueprints,
            code packages, tests, deployment assets, and certification.
          </p>
          <b>{status.genesisEngine.projects} projects</b>
        </article>
      </section>

      <section className="ee-grid">
        <article className="ee-panel">
          <header>
            <div>
              <span>Enterprise Cloud</span>
              <h2>Cloud Nodes</h2>
            </div>
          </header>
          <div className="ee-list">
            {dashboard.cloudNodes.map((node) => (
              <article key={node.id}>
                <div>
                  <strong>{node.id}</strong>
                  <small>
                    {node.provider} / {node.region} / {node.zone}
                  </small>
                </div>
                <aside>
                  <b>{node.runtime}</b>
                  <span>{node.status}</span>
                  <small>
                    {node.cpu} CPU / {node.memoryGb} GB
                  </small>
                </aside>
              </article>
            ))}
          </div>
        </article>

        <article className="ee-panel">
          <header>
            <div>
              <span>AI Organization OS</span>
              <h2>Specialist Teams</h2>
            </div>
          </header>
          <div className="ee-list">
            {dashboard.teams.map((team) => (
              <article key={team.id}>
                <div>
                  <strong>{team.name}</strong>
                  <small>{team.mission}</small>
                </div>
                <aside>
                  <b>{team.status}</b>
                  <span>{team.agents.length} agents</span>
                </aside>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="ee-panel">
        <header>
          <div>
            <span>Genesis Production</span>
            <h2>Generated Ventures and Platforms</h2>
          </div>
          <small>Human approval gates enforced</small>
        </header>

        {dashboard.genesisProjects.length === 0 ? (
          <p className="ee-empty">
            No Genesis projects yet. Create one from the control bar.
          </p>
        ) : (
          <div className="ee-projects">
            {dashboard.genesisProjects.map((project) => (
              <article key={project.id}>
                <strong>{project.name}</strong>
                <span>{project.type}</span>
                <small>{project.objective}</small>
                <b>{project.status}</b>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}