import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainConflictRecord } from "../enterprise-brain-mega-pack-5.types";
import { BrainConsensusService } from "../consensus/brain-consensus.service";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainConflictResolutionService {
  private readonly records = new Map<string, BrainConflictRecord>();

  constructor(
    private readonly consensus: BrainConsensusService,
    private readonly audit: BrainMultiAgentAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Brain conflict not found: ${id}`);
    }

    return record;
  }

  create(input: {
    subjectId: string;
    agentIds: string[];
    conflictType: BrainConflictRecord["conflictType"];
    description: string;
    severity: BrainConflictRecord["severity"];
    proposals: BrainConflictRecord["proposals"];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const now = new Date().toISOString();

    const record: BrainConflictRecord = {
      id: `brain-conflict:${Date.now()}:${this.records.size + 1}`,
      subjectId: input.subjectId,
      agentIds: Array.from(new Set(input.agentIds)),
      conflictType: input.conflictType,
      description: input.description,
      severity: input.severity,
      proposals: input.proposals.map((proposal) => ({
        ...proposal,
        confidence: Math.max(0, Math.min(100, proposal.confidence))
      })),
      resolvedBy: "rule",
      status: "open",
      createdAt: now,
      updatedAt: now
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "conflict",
      action: "brain-conflict-created",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        record.severity === "critical"
          ? "warning"
          : "success",
      metadata: {
        conflictType: record.conflictType,
        severity: record.severity
      }
    });

    return record;
  }

  resolve(input: {
    conflictId: string;
    resolution: string;
    resolvedBy: BrainConflictRecord["resolvedBy"];
    approvedByIdentityId?: string;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const current = this.get(input.conflictId);

    const requiresHuman =
      current.severity === "critical" ||
      input.resolvedBy === "human";

    const updated: BrainConflictRecord = {
      ...current,
      resolution: input.resolution,
      resolvedBy: input.resolvedBy,
      status:
        requiresHuman &&
        !input.approvedByIdentityId
          ? "escalated"
          : "resolved",
      approvedByIdentityId:
        input.approvedByIdentityId,
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);

    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      open: items.filter((x) => x.status === "open").length,
      resolved: items.filter((x) => x.status === "resolved").length,
      escalated: items.filter((x) => x.status === "escalated").length,
      critical: items.filter((x) => x.severity === "critical").length
    };
  }
}
