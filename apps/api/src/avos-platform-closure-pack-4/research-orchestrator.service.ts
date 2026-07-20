import { Injectable, NotFoundException } from '@nestjs/common';
import { LivingMemoryService } from '../avos-platform-closure-pack-1/living-memory.service';
import { TeamRuntimeService } from '../avos-platform-closure-pack-2/team-runtime.service';
import { WorkflowRuntimeService } from '../avos-platform-closure-pack-3/workflow-runtime.service';
import { EvidenceRegistryService } from './evidence-registry.service';
import {
  ResearchRequest,
  ResearchRequestInput,
} from './knowledge-runtime.types';

@Injectable()
export class ResearchOrchestratorService {
  private readonly requests = new Map<string, ResearchRequest>();

  constructor(
    private readonly teams: TeamRuntimeService,
    private readonly workflows: WorkflowRuntimeService,
    private readonly evidence: EvidenceRegistryService,
    private readonly livingMemory: LivingMemoryService,
  ) {}

  create(input: ResearchRequestInput): ResearchRequest {
    const team = this.teams.require(input.teamId);

    if (team.status !== 'active') {
      throw new Error('Research requires an active digital team.');
    }

    if (
      team.projectId !== input.projectId ||
      team.livingVisionId !== input.livingVisionId
    ) {
      throw new Error('Research must match team project and Living Vision.');
    }

    if (input.workflowId) {
      const workflow = this.workflows.get(input.workflowId);

      if (
        workflow.teamId !== input.teamId ||
        workflow.projectId !== input.projectId
      ) {
        throw new Error('Research workflow boundary mismatch.');
      }
    }

    const now = new Date().toISOString();

    const request: ResearchRequest = {
      id: `research-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      teamId: input.teamId,
      workflowId: input.workflowId,
      question: input.question,
      requiredEvidenceCount: input.requiredEvidenceCount ?? 2,
      requestedBy: input.requestedBy,
      strategic: input.strategic ?? false,
      status: 'created',
      evidenceIds: [],
      confidence: 0,
      publishedMemoryIds: [],
      createdAt: now,
      updatedAt: now,
    };

    this.requests.set(request.id, request);
    return this.clone(request);
  }

  attachEvidence(id: string, evidenceId: string): ResearchRequest {
    const request = this.require(id);
    const evidence = this.evidence.get(evidenceId);

    if (
      evidence.projectId !== request.projectId ||
      evidence.livingVisionId !== request.livingVisionId
    ) {
      throw new Error('Evidence does not match research boundaries.');
    }

    if (evidence.status !== 'approved') {
      throw new Error('Only approved evidence may support research.');
    }

    request.evidenceIds = [...new Set([...request.evidenceIds, evidenceId])];
    request.status = 'collecting';
    request.updatedAt = new Date().toISOString();

    return this.clone(request);
  }

  conclude(id: string, conclusion: string): ResearchRequest {
    const request = this.require(id);

    if (request.evidenceIds.length < request.requiredEvidenceCount) {
      throw new Error(
        `Research requires at least ${request.requiredEvidenceCount} approved evidence records.`,
      );
    }

    const evidence = request.evidenceIds.map((evidenceId) =>
      this.evidence.get(evidenceId),
    );

    request.conclusion = conclusion;
    request.confidence = Math.round(
      evidence.reduce((sum, item) => sum + item.confidence, 0) /
        evidence.length,
    );
    request.status = request.strategic
      ? 'awaiting-approval'
      : 'approved';
    request.updatedAt = new Date().toISOString();

    return this.clone(request);
  }

  approve(
    id: string,
    input: { approvedBy: string; action: 'approved' | 'rejected' },
  ): ResearchRequest {
    const request = this.require(id);

    if (!input.approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Strategic research approval requires human authority.');
    }

    request.status =
      input.action === 'approved' ? 'approved' : 'rejected';
    request.approvedBy = input.approvedBy;
    request.updatedAt = new Date().toISOString();

    return this.clone(request);
  }

  publish(id: string): ResearchRequest {
    const request = this.require(id);

    if (request.status !== 'approved') {
      throw new Error('Only approved research may be published.');
    }

    const memory = this.livingMemory.capture({
      projectId: request.projectId,
      livingVisionId: request.livingVisionId,
      kind: 'lesson',
      title: `Research conclusion: ${request.question.slice(0, 80)}`,
      content: request.conclusion ?? '',
      source: request.id,
      tags: ['research', 'approved-evidence', 'shared-knowledge'],
      confidence: request.confidence,
    });

    request.publishedMemoryIds.push(memory.id);
    request.status = 'published';
    request.updatedAt = new Date().toISOString();

    return this.clone(request);
  }

  get(id: string): ResearchRequest {
    return this.clone(this.require(id));
  }

  list(): ResearchRequest[] {
    return [...this.requests.values()].map((request) =>
      this.clone(request),
    );
  }

  private require(id: string): ResearchRequest {
    const request = this.requests.get(id);

    if (!request) {
      throw new NotFoundException(`Research request ${id} was not found.`);
    }

    return request;
  }

  private clone(request: ResearchRequest): ResearchRequest {
    return JSON.parse(JSON.stringify(request)) as ResearchRequest;
  }
}