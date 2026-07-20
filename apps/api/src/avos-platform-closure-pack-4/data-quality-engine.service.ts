import { Injectable } from '@nestjs/common';
import {
  DataQualityResult,
  EvidenceRecord,
} from './knowledge-runtime.types';

@Injectable()
export class DataQualityEngineService {
  evaluate(record: EvidenceRecord): DataQualityResult {
    const checks = {
      sourceReference: record.sourceReference.trim().length >= 3,
      contentLength: record.content.trim().length >= 20,
      confidenceRange: record.confidence >= 0 && record.confidence <= 100,
      projectAlignment: record.projectId.trim().length > 0,
      livingVisionAlignment: record.livingVisionId.trim().length > 0,
      jurisdictionMetadata:
        record.sourceType === 'external'
          ? Boolean(record.jurisdiction)
          : true,
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passed / Object.keys(checks).length) * 100);
    const notes = Object.entries(checks)
      .filter(([, value]) => !value)
      .map(([key]) => `Failed data-quality check: ${key}`);

    return {
      evidenceId: record.id,
      score,
      valid: score >= 80,
      checks,
      notes,
    };
  }
}