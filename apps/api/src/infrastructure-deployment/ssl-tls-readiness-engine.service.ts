import { Injectable } from '@nestjs/common';

@Injectable()
export class SslTlsReadinessEngineService {
  evaluate(input: {
    certificateValid: boolean;
    autoRenewal: boolean;
    tls12OrHigher: boolean;
    hstsEnabled: boolean;
    weakCiphersDisabled: boolean;
    redirectHttpToHttps: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      ready: score === 100,
    };
  }
}