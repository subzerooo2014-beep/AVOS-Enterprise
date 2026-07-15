import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FOUNDATION_POLICIES,
  FOUNDATION_QUALITY_GATES,
  FOUNDATION_STAGE_ORDER,
} from "./foundation-governance.registry";
import {
  FoundationEvidence,
  FoundationGateResult,
  FoundationStage,
  ProductFoundationRegistration,
} from "./foundation-governance.types";

@Injectable()
export class FoundationGovernanceService {
  private readonly registrations = new Map<
    string,
    ProductFoundationRegistration
  >();

  getFramework() {
    return {
      system: "AVOS Foundation Governance & Conformance Engine",
      version: "1.0.0",
      status: "OFFICIAL",
      stageOrder: [...FOUNDATION_STAGE_ORDER],
      policies: FOUNDATION_POLICIES.map((policy) => ({ ...policy })),
      qualityGates: [...FOUNDATION_QUALITY_GATES],
    };
  }

  registerProduct(input: {
    productName: string;
    productType: ProductFoundationRegistration["productType"];
    owner: string;
  }): ProductFoundationRegistration {
    const now = new Date().toISOString();

    const registration: ProductFoundationRegistration = {
      id: randomUUID(),
      productName: input.productName.trim(),
      productType: input.productType,
      owner: input.owner.trim(),
      currentStage: "VISION",
      completedStages: [],
      evidence: [],
      status: "DRAFT",
      violations: [],
      createdAt: now,
      updatedAt: now,
    };

    if (!registration.productName) {
      throw new Error("Product name is required");
    }

    if (!registration.owner) {
      throw new Error("Product owner is required");
    }

    this.registrations.set(registration.id, registration);
    return this.cloneRegistration(registration);
  }

  addEvidence(
    productId: string,
    input: Omit<FoundationEvidence, "id" | "verified" | "verifiedAt">,
  ): ProductFoundationRegistration {
    const registration = this.requireRegistration(productId);

    const evidence: FoundationEvidence = {
      ...input,
      id: randomUUID(),
      verified: false,
    };

    registration.evidence.push(evidence);
    registration.updatedAt = new Date().toISOString();
    this.registrations.set(productId, registration);

    return this.cloneRegistration(registration);
  }

  verifyEvidence(
    productId: string,
    evidenceId: string,
  ): ProductFoundationRegistration {
    const registration = this.requireRegistration(productId);
    const evidence = registration.evidence.find(
      (item) => item.id === evidenceId,
    );

    if (!evidence) {
      throw new Error(`Foundation evidence not found: ${evidenceId}`);
    }

    evidence.verified = true;
    evidence.verifiedAt = new Date().toISOString();
    registration.updatedAt = evidence.verifiedAt;
    this.registrations.set(productId, registration);

    return this.cloneRegistration(registration);
  }

  evaluateGate(
    productId: string,
    requestedStage: FoundationStage,
  ): FoundationGateResult {
    const registration = this.requireRegistration(productId);
    const requestedIndex = FOUNDATION_STAGE_ORDER.indexOf(requestedStage);

    if (requestedIndex < 0) {
      throw new Error(`Unknown foundation stage: ${requestedStage}`);
    }

    const requiredPreviousStages = FOUNDATION_STAGE_ORDER.slice(
      0,
      requestedIndex,
    );

    const missingStages = requiredPreviousStages.filter(
      (stage) => !registration.completedStages.includes(stage),
    );

    const unverifiedEvidence = requiredPreviousStages
      .filter((stage) => registration.completedStages.includes(stage))
      .filter((stage) => {
        const stageEvidence = registration.evidence.filter(
          (item) => item.stage === stage,
        );

        return (
          stageEvidence.length === 0 ||
          stageEvidence.some((item) => !item.verified)
        );
      });

    const violations: string[] = [];

    if (missingStages.length > 0) {
      violations.push(
        `Missing prerequisite stages: ${missingStages.join(", ")}`,
      );
    }

    if (unverifiedEvidence.length > 0) {
      violations.push(
        `Unverified evidence for stages: ${unverifiedEvidence.join(", ")}`,
      );
    }

    return {
      productId,
      requestedStage,
      allowed:
        missingStages.length === 0 &&
        unverifiedEvidence.length === 0,
      missingStages,
      unverifiedEvidence,
      violations,
      evaluatedAt: new Date().toISOString(),
    };
  }

  completeStage(
    productId: string,
    stage: FoundationStage,
  ): ProductFoundationRegistration {
    const registration = this.requireRegistration(productId);
    const stageIndex = FOUNDATION_STAGE_ORDER.indexOf(stage);

    if (stageIndex < 0) {
      throw new Error(`Unknown foundation stage: ${stage}`);
    }

    const requiredPreviousStages = FOUNDATION_STAGE_ORDER.slice(
      0,
      stageIndex,
    );

    const missingStages = requiredPreviousStages.filter(
      (requiredStage) =>
        !registration.completedStages.includes(requiredStage),
    );

    if (missingStages.length > 0) {
      registration.status = "BLOCKED";
      registration.violations = [
        `Cannot complete ${stage}; missing: ${missingStages.join(", ")}`,
      ];
      registration.updatedAt = new Date().toISOString();
      this.registrations.set(productId, registration);

      throw new Error(registration.violations[0]);
    }

    const verifiedEvidence = registration.evidence.some(
      (evidence) =>
        evidence.stage === stage &&
        evidence.verified,
    );

    if (!verifiedEvidence) {
      throw new Error(
        `Cannot complete ${stage}; verified evidence is required`,
      );
    }

    if (!registration.completedStages.includes(stage)) {
      registration.completedStages.push(stage);
    }

    const nextStage =
      FOUNDATION_STAGE_ORDER[stageIndex + 1] ?? stage;

    registration.currentStage = nextStage;
    registration.status =
      stage === "PRODUCT_DEVELOPMENT"
        ? "CONFORMANT"
        : "UNDER_REVIEW";
    registration.violations = [];
    registration.updatedAt = new Date().toISOString();

    this.registrations.set(productId, registration);
    return this.cloneRegistration(registration);
  }

  auditProduct(productId: string) {
    const registration = this.requireRegistration(productId);

    const missingStages = FOUNDATION_STAGE_ORDER.filter(
      (stage) => !registration.completedStages.includes(stage),
    );

    const unverifiedEvidence = registration.evidence
      .filter((item) => !item.verified)
      .map((item) => item.id);

    const duplicateEvidenceReferences = registration.evidence
      .map((item) => item.reference)
      .filter(
        (reference, index, all) =>
          all.indexOf(reference) !== index,
      );

    const conformant =
      missingStages.length === 0 &&
      unverifiedEvidence.length === 0 &&
      duplicateEvidenceReferences.length === 0;

    return {
      productId,
      productName: registration.productName,
      conformant,
      status: conformant
        ? "CONFORMANT"
        : "NON_CONFORMANT",
      completedStages: [...registration.completedStages],
      missingStages,
      unverifiedEvidence,
      duplicateEvidenceReferences: [
        ...new Set(duplicateEvidenceReferences),
      ],
      policyCount: FOUNDATION_POLICIES.length,
      auditedAt: new Date().toISOString(),
    };
  }

  listRegistrations(): ProductFoundationRegistration[] {
    return Array.from(this.registrations.values()).map((item) =>
      this.cloneRegistration(item),
    );
  }

  getRegistration(id: string): ProductFoundationRegistration {
    return this.cloneRegistration(this.requireRegistration(id));
  }

  private requireRegistration(
    id: string,
  ): ProductFoundationRegistration {
    const registration = this.registrations.get(id);

    if (!registration) {
      throw new Error(`Foundation registration not found: ${id}`);
    }

    return registration;
  }

  private cloneRegistration(
    value: ProductFoundationRegistration,
  ): ProductFoundationRegistration {
    return {
      ...value,
      completedStages: [...value.completedStages],
      evidence: value.evidence.map((item) => ({ ...item })),
      violations: [...value.violations],
    };
  }
}