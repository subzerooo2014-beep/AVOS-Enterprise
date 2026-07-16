import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityApprovalService } from "./capability-approval.service";
import { CapabilityArchiveRecord } from "./capability-enterprise.types";

@Injectable()
export class CapabilityArchiveService {
  private readonly records = new Map<string, CapabilityArchiveRecord>();

  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly approvals: CapabilityApprovalService,
  ) {}

  archive(input: {
    capabilityKey: string;
    reason: string;
    replacementCapabilityKey?: string;
    retainedEvidence?: string[];
    archivedBy: string;
  }) {
    if (!this.approvals.isApproved(input.capabilityKey, "ARCHIVE")) {
      return { success: false, reason: "ARCHIVE_APPROVAL_REQUIRED" };
    }

    const transition = this.registry.transitionStatus(
      input.capabilityKey,
      "ARCHIVED",
    );

    if (!transition.success) {
      return transition;
    }

    const record: CapabilityArchiveRecord = {
      id: randomUUID(),
      capabilityKey: input.capabilityKey.toLowerCase(),
      reason: input.reason,
      replacementCapabilityKey: input.replacementCapabilityKey,
      retainedEvidence: [...(input.retainedEvidence ?? [])],
      archivedBy: input.archivedBy,
      archivedAt: new Date().toISOString(),
    };

    this.records.set(record.capabilityKey, record);
    return { success: true, record: structuredClone(record) };
  }

  list() {
    return [...this.records.values()].map((record) =>
      structuredClone(record),
    );
  }
}