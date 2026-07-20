import { Injectable, NotFoundException } from '@nestjs/common';
import { LivingVisionGovernanceService } from '../avos-platform-closure-pack-0-5/living-vision-governance.service';
import { DataQualityEngineService } from './data-quality-engine.service';
import {
  EvidenceInput,
  EvidenceRecord,
} from './knowledge-runtime.types';

@Injectable()
export class EvidenceRegistryService {
  private readonly records = new Map<string, EvidenceRecord>();

  constructor(
    private readonly quality: DataQualityEngineService,
    private readonly livingVision: LivingVisionGovernanceService,
  ) {}

  capture(input: EvidenceInput): EvidenceRecord {
    if (!this.livingVision.isLinked(input.projectId, input.livingVisionId)) {
      throw new Error('Evidence requires an active Living Vision link.');
    }

    const now = new Date().toISOString();

    const record: EvidenceRecord = {
      id: `evidence-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      title: input.title,
      sourceType: input.sourceType,
      sourceReference: input.sourceReference,
      content: input.content,
      confidence: input.confidence,
      jurisdiction: input.jurisdiction,
      tags: [...new Set(input.tags ?? [])],
      capturedBy: input.capturedBy,
      status: 'captured',
      qualityScore: 0,
      validationNotes: [],
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    return this.clone(record);
  }

  validate(id: string): EvidenceRecord {
    const record = this.require(id);
    const result = this.quality.evaluate(record);

    record.qualityScore = result.score;
    record.validationNotes = result.notes;
    record.status = result.valid ? 'validated' : 'rejected';
    record.updatedAt = new Date().toISOString();

    return this.clone(record);
  }

  approve(id: string, approvedBy: string): EvidenceRecord {
    const record = this.require(id);

    if (record.status !== 'validated') {
      throw new Error('Only validated evidence can be approved.');
    }

    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Evidence approval requires Human Final Authority.');
    }

    record.status = 'approved';
    record.approvedBy = approvedBy;
    record.updatedAt = new Date().toISOString();

    return this.clone(record);
  }

  supersede(
    id: string,
    replacementId: string,
    approvedBy: string,
  ): EvidenceRecord {
    const current = this.require(id);
    const replacement = this.require(replacementId);

    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Evidence supersession requires human approval.');
    }

    if (replacement.status !== 'approved') {
      throw new Error('Replacement evidence must already be approved.');
    }

    current.status = 'superseded';
    replacement.supersedesId = current.id;
    current.updatedAt = new Date().toISOString();
    replacement.updatedAt = current.updatedAt;

    return this.clone(current);
  }

  get(id: string): EvidenceRecord {
    return this.clone(this.require(id));
  }

  list(): EvidenceRecord[] {
    return [...this.records.values()].map((record) => this.clone(record));
  }

  approvedForProject(
    projectId: string,
    livingVisionId: string,
  ): EvidenceRecord[] {
    return [...this.records.values()]
      .filter(
        (record) =>
          record.projectId === projectId &&
          record.livingVisionId === livingVisionId &&
          record.status === 'approved',
      )
      .map((record) => this.clone(record));
  }

  private require(id: string): EvidenceRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Evidence ${id} was not found.`);
    }

    return record;
  }

  private clone(record: EvidenceRecord): EvidenceRecord {
    return JSON.parse(JSON.stringify(record)) as EvidenceRecord;
  }
}