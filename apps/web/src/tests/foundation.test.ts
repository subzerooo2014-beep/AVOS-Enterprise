import { describe, expect, it } from '@jest/globals';
import { avosConfig } from '@/lib/config';
import { publicNavigation } from '@/lib/navigation';

describe('AVOS Website Foundation', () => {
  it('has an application name', () => {
    expect(avosConfig.appName).toBeTruthy();
  });

  it('has a configured API base URL', () => {
    expect(avosConfig.apiBaseUrl).toMatch(/^https?:\/\//);
  });

  it('contains core public navigation', () => {
    expect(publicNavigation.length).toBeGreaterThanOrEqual(6);
  });
});