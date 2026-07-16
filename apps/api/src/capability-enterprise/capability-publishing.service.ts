import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityApprovalService } from "./capability-approval.service";
import { CapabilityCertificationService } from "./capability-certification.service";
import { CapabilityPublication } from "./capability-enterprise.types";

@Injectable()
export class CapabilityPublishingService {
  private readonly publications = new Map<string, CapabilityPublication>();

  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly approvals: CapabilityApprovalService,
    private readonly certifications: CapabilityCertificationService,
  ) {}

  create(input: {
    capabilityKey: string;
    channel: CapabilityPublication["channel"];
    displayName: string;
    summary: string;
    termsRef?: string;
    documentationRef?: string;
  }) {
    const capability = this.registry.get(input.capabilityKey);
    if (!capability) {
      return { success: false, reason: "CAPABILITY_NOT_REGISTERED" };
    }

    if (this.publications.has(capability.identity.key)) {
      return { success: false, reason: "PUBLICATION_ALREADY_EXISTS" };
    }

    const now = new Date().toISOString();
    const publication: CapabilityPublication = {
      id: randomUUID(),
      capabilityKey: capability.identity.key,
      channel: input.channel,
      status: "DRAFT",
      displayName: input.displayName,
      summary: input.summary,
      version: capability.version,
      termsRef: input.termsRef,
      documentationRef: input.documentationRef,
      createdAt: now,
      updatedAt: now,
    };

    this.publications.set(capability.identity.key, publication);
    return { success: true, publication: structuredClone(publication) };
  }

  publish(capabilityKey: string, publishedBy: string) {
    const publication = this.require(capabilityKey);

    if (!this.approvals.isApproved(capabilityKey, "PUBLISH")) {
      return { success: false, reason: "PUBLICATION_APPROVAL_REQUIRED" };
    }

    if (
      publication.channel === "MARKETPLACE" &&
      !this.certifications.get(capabilityKey)
    ) {
      return {
        success: false,
        reason: "MARKETPLACE_CERTIFICATION_REQUIRED",
      };
    }

    publication.status = "PUBLISHED";
    publication.publishedBy = publishedBy;
    publication.publishedAt = new Date().toISOString();
    publication.updatedAt = publication.publishedAt;

    return { success: true, publication: structuredClone(publication) };
  }

  get(capabilityKey: string) {
    const publication = this.publications.get(capabilityKey.toLowerCase());
    return publication ? structuredClone(publication) : null;
  }

  list() {
    return [...this.publications.values()].map((publication) =>
      structuredClone(publication),
    );
  }

  private require(capabilityKey: string) {
    const publication = this.publications.get(capabilityKey.toLowerCase());
    if (!publication) {
      throw new Error(`Capability publication not found: ${capabilityKey}`);
    }
    return publication;
  }
}