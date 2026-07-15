import { Injectable } from '@nestjs/common';
import { SignoffRecord } from './production-certification.types';

@Injectable()
export class OperationsSignoffEngineService {
  evaluate(signoffs: SignoffRecord[]) {
    const operations = signoffs.find(
      (signoff) => signoff.role === 'operations',
    );

    return {
      signoffs,
      approved: Boolean(operations?.approved),
      approvedAt: operations?.approvedAt ?? null,
    };
  }
}