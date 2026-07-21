import type { AdvancedWindow } from './types';

const KEY = 'avos.digital-workplace.advanced.session.v1';

export interface AdvancedSession {
  workspaceId: string;
  activeDisplayId: string;
  activeWindowId: string | null;
  windows: AdvancedWindow[];
}

export function loadAdvancedSession(): AdvancedSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdvancedSession) : null;
  } catch {
    return null;
  }
}

export function saveAdvancedSession(session: AdvancedSession): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(session));
}