import { Injectable } from '@nestjs/common';
import { SignoffRecord } from './production-certification.types';

@Injectable()
export class QualitySignoffEngineService {
  evaluate(signoffs: SignoffRecord[]) {
    const qa = signoffs.find((signoff) => signoff.role === 'qa');

    return {
      signoffs,
      approved: Boolean(qa?.approved),
      approvedAt: qa?.approvedAt ?? null,
    };
  }
}