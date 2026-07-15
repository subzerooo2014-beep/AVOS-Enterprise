import { Injectable } from '@nestjs/common';

@Injectable()
export class SecretExposureAuditEngineService {
  scan(entries: Array<{ path: string; content: string }>) {
    const patterns = [
      /BEGIN PRIVATE KEY/i,
      /AWS_SECRET_ACCESS_KEY/i,
      /DATABASE_URL\s*=\s*[^$]/i,
      /JWT_SECRET\s*=\s*[^$]/i,
      /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    ];

    const findings = entries.flatMap((entry) =>
      patterns
        .filter((pattern) => pattern.test(entry.content))
        .map((pattern) => ({
          path: entry.path,
          pattern: pattern.source,
        })),
    );

    return {
      scanned: entries.length,
      findings,
      passed: findings.length === 0,
    };
  }
}