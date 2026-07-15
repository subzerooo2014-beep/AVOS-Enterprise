import { Injectable } from '@nestjs/common';
import { SignoffRecord } from './production-certification.types';

@Injectable()
export class SecuritySignoffEngineService {
  evaluate(signoffs: SignoffRecord[]) {
    const security = signoffs.find(
      (signoff) => signoff.role === 'security',
    );

    return {
      signoffs,
      approved: Boolean(security?.approved),
      approvedAt: security?.approvedAt ?? null,
    };
  }
}