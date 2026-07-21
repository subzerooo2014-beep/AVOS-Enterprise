'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  loadAdvancedSession,
  saveAdvancedSession,
} from '../../lib/digital-workplace-advanced/persistence';
import type {
  AdvancedWindow,
  MonitorServiceState,
  RuntimeIdentity,
} from '../../lib/digital-workplace-advanced/types';
import { workplaceEventBus } from '../../lib/digital-workplace-advanced/event-bus';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const apps = [
  { id: 'marketplace', title: 'AVOS Marketplace' },
  { id: 'factory', title: 'AVOS Factory' },
  { id: 'knowledge-fabric', title: 'Knowledge Fabric' },
  { id: 'intelligence-fabric', title: 'Intelligence Fabric' },
  { id: 'system-monitor', title: 'Live System Monitor' },
  { id: 'command-center', title: 'Universal Command Center' },
];

export function AdvancedWorkplace() {
  const [windows, setWindows] = useState<AdvancedWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [activeDisplayId, setActiveDisplayId] = useState('display-1');
  const [identity, setIdentity] = useState<RuntimeIdentity | null>(null);
  const [monitor, setMonitor] = useState<MonitorServiceState[]>([]);
  const [command, setCommand] = useState('');
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [activity, setActivity] = useState<string[]>([]);
  const dragState = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    const restored = loadAdvancedSession();
    if (restored) {
      setWindows(restored.windows);
      setActiveWindowId(restored.activeWindowId);
      setActiveDisplayId(restored.activeDisplayId);
    }

    Promise.all([
      fetch(`${API_BASE}/avos/digital-workplace/advanced/identity`).then((r) => r.json()),
      fetch(`${API_BASE}/avos/digital-workplace/advanced/monitor`).then((r) => r.json()),
    ])
      .then(([identityData, monitorData]) => {
        setIdentity(identityData);
        setMonitor(monitorData);
      })
      .catch(() => undefined);

    const unsubscribe = workplaceEventBus.subscribe('*', (event) => {
      setActivity((current) => [
        `${event.source}: ${event.topic}`,
        ...current,
      ].slice(0, 8));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    saveAdvancedSession({
      workspaceId: 'advanced',
      activeDisplayId,
      activeWindowId,
      windows,
    });
  }, [activeDisplayId, activeWindowId, windows]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!dragState.current) return;
      const { id, offsetX, offsetY } = dragState.current;
      setWindows((current) =>
        current.map((item) =>
          item.id === id && !item.maximized
            ? {
                ...item,
                x: Math.max(0, event.clientX - offsetX),
                y: Math.max(0, event.clientY - offsetY - 64),
              }
            : item,
        ),
      );
    };

    const onUp = () => {
      dragState.current = null;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const displayWindows = useMemo(
    () => windows.filter((item) => item.displayId === activeDisplayId),
    [activeDisplayId, windows],
  );

  function openApp(applicationId: string, title: string) {
    const existing = windows.find((item) => item.applicationId === applicationId);
    if (existing) {
      setActiveWindowId(existing.id);
      setWindows((current) =>
        current.map((item) =>
          item.id === existing.id ? { ...item, minimized: false } : item,
        ),
      );
      return;
    }

    const created: AdvancedWindow = {
      id: `window:${applicationId}:${Date.now()}`,
      applicationId,
      title,
      x: 240 + windows.length * 25,
      y: 90 + windows.length * 20,
      width: 720,
      height: 470,
      minimized: false,
      maximized: false,
      displayId: activeDisplayId,
      zIndex: windows.length + 1,
    };

    setWindows((current) => [...current, created]);
    setActiveWindowId(created.id);
    workplaceEventBus.publish({
      topic: 'application.opened',
      source: 'advanced-window-manager',
      payload: { applicationId },
      timestamp: new Date().toISOString(),
    });
  }

  function arrangeWindows() {
    setWindows((current) =>
      current.map((item, index) => ({
        ...item,
        x: 40 + (index % 3) * 380,
        y: 60 + Math.floor(index / 3) * 280,
        width: 360,
        height: 250,
        maximized: false,
        minimized: false,
      })),
    );
  }

  function moveToDisplay(id: string) {
    setWindows((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              displayId: item.displayId === 'display-1' ? 'display-2' : 'display-1',
            }
          : item,
      ),
    );
  }

  async function executeCommand() {
    if (!command.trim()) return;
    const result = await fetch(`${API_BASE}/avos/digital-workplace/advanced/commands`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ command }),
    }).then((r) => r.json());

    setActivity((current) => [
      `Command: ${result.status}`,
      ...current,
    ].slice(0, 8));
    setCommand('');
  }

  async function askAssistant() {
    if (!assistantPrompt.trim()) return;
    const result = await fetch(`${API_BASE}/avos/digital-workplace/advanced/assistant`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: assistantPrompt }),
    }).then((r) => r.json());

    setActivity((current) => [
      `AI: ${result.action} — ${result.recommendation}`,
      ...current,
    ].slice(0, 8));
    setAssistantPrompt('');
  }

  return (
    <main className="adw-root">
      <header className="adw-header">
        <div>
          <strong>AVOS</strong>
          <span>Advanced Digital Workplace</span>
        </div>
        <nav>
          <button onClick={arrangeWindows}>Auto Arrange</button>
          <button onClick={() => setActiveDisplayId('display-1')}>Display 1</button>
          <button onClick={() => setActiveDisplayId('display-2')}>Display 2</button>
          <span>{identity?.displayName ?? 'Human Authority'}</span>
        </nav>
      </header>

      <section className="adw-body">
        <aside className="adw-sidebar">
          <h2>Applications</h2>
          {apps.map((app) => (
            <button key={app.id} onClick={() => openApp(app.id, app.title)}>
              {app.title}
            </button>
          ))}

          <h2>Command Center</h2>
          <input
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="Enter unified command..."
          />
          <button onClick={executeCommand}>Execute Command</button>

          <h2>AI Desktop Assistant</h2>
          <textarea
            value={assistantPrompt}
            onChange={(event) => setAssistantPrompt(event.target.value)}
            placeholder="Ask AVOS to open, arrange, or analyze..."
          />
          <button onClick={askAssistant}>Run Assistant</button>
        </aside>

        <section className="adw-desktop">
          <div className="adw-display-label">
            Active display: {activeDisplayId === 'display-1' ? 'Primary' : 'Secondary'}
          </div>

          {displayWindows
            .filter((item) => !item.minimized)
            .map((item) => (
              <article
                key={item.id}
                className={`adw-window ${item.maximized ? 'is-maximized' : ''} ${
                  activeWindowId === item.id ? 'is-active' : ''
                }`}
                style={{
                  left: item.maximized ? 0 : item.x,
                  top: item.maximized ? 0 : item.y,
                  width: item.maximized ? '100%' : item.width,
                  height: item.maximized ? '100%' : item.height,
                  zIndex: activeWindowId === item.id ? 200 : item.zIndex,
                }}
                onMouseDown={() => setActiveWindowId(item.id)}
              >
                <header
                  onMouseDown={(event) => {
                    if (item.maximized) return;
                    dragState.current = {
                      id: item.id,
                      offsetX: event.clientX - item.x,
                      offsetY: event.clientY - item.y,
                    };
                  }}
                >
                  <strong>{item.title}</strong>
                  <nav>
                    <button onClick={() => moveToDisplay(item.id)}>⇄</button>
                    <button
                      onClick={() =>
                        setWindows((current) =>
                          current.map((entry) =>
                            entry.id === item.id
                              ? { ...entry, minimized: true }
                              : entry,
                          ),
                        )
                      }
                    >
                      —
                    </button>
                    <button
                      onClick={() =>
                        setWindows((current) =>
                          current.map((entry) =>
                            entry.id === item.id
                              ? { ...entry, maximized: !entry.maximized }
                              : entry,
                          ),
                        )
                      }
                    >
                      □
                    </button>
                    <button
                      onClick={() =>
                        setWindows((current) =>
                          current.filter((entry) => entry.id !== item.id),
                        )
                      }
                    >
                      ×
                    </button>
                  </nav>
                </header>

                <div className="adw-window-content">
                  {item.applicationId === 'system-monitor' ? (
                    <div className="adw-monitor-grid">
                      {monitor.map((service) => (
                        <article key={service.id}>
                          <span>{service.status}</span>
                          <strong>{service.name}</strong>
                          <small>
                            Health {service.healthScore} · {service.latencyMs}ms
                          </small>
                        </article>
                      ))}
                    </div>
                  ) : item.applicationId === 'command-center' ? (
                    <div>
                      <h3>Universal Command Center</h3>
                      <p>Execute unified actions across all registered AVOS applications.</p>
                      <ul>
                        {activity.map((entry, index) => (
                          <li key={`${entry}-${index}`}>{entry}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="adw-microfrontend">
                      <span>Dynamic Micro-Frontend</span>
                      <h3>{item.title}</h3>
                      <p>
                        Loaded through the AVOS runtime manifest with isolated execution
                        and shared identity, event bus, notifications, and permissions.
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className="adw-resize-handle"
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    const startX = event.clientX;
                    const startY = event.clientY;
                    const startWidth = item.width;
                    const startHeight = item.height;

                    const resize = (move: MouseEvent) => {
                      setWindows((current) =>
                        current.map((entry) =>
                          entry.id === item.id
                            ? {
                                ...entry,
                                width: Math.max(360, startWidth + move.clientX - startX),
                                height: Math.max(240, startHeight + move.clientY - startY),
                              }
                            : entry,
                        ),
                      );
                    };

                    const stop = () => {
                      window.removeEventListener('mousemove', resize);
                      window.removeEventListener('mouseup', stop);
                    };

                    window.addEventListener('mousemove', resize);
                    window.addEventListener('mouseup', stop);
                  }}
                />
              </article>
            ))}
        </section>
      </section>

      <footer className="adw-taskbar">
        <strong>HFA Active</strong>
        <div>
          {windows.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveWindowId(item.id);
                setActiveDisplayId(item.displayId);
                setWindows((current) =>
                  current.map((entry) =>
                    entry.id === item.id ? { ...entry, minimized: false } : entry,
                  ),
                );
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
        <span>Event Bus Online · Monitor 100</span>
      </footer>
    </main>
  );
}