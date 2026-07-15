import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AVOS_FOUNDATION_STANDARDS,
  AVOS_QUALITY_GATES,
  FOUNDATION_DOMAINS,
  PRODUCT_LIFECYCLE_ORDER,
} from "./foundation-mega-bundle.registry";
import {
  ArchitectureDecisionRecord,
  FoundationMasterRecord,
  LifecycleStage,
  ProductLifecycleRecord,
} from "./foundation-mega-bundle.types";

@Injectable()
export class FoundationMegaBundleService {
  private readonly foundations = new Map<string, FoundationMasterRecord>();
  private readonly decisions = new Map<string, ArchitectureDecisionRecord>();
  private readonly products = new Map<string, ProductLifecycleRecord>();
  private readonly foundationCodeIndex = new Map<string, string>();
  private readonly decisionCodeIndex = new Map<string, string>();

  framework() {
    return {
      system: "AVOS Foundation Mega Bundle V1",
      status: "OFFICIAL CORE FOUNDATION",
      domains: [...FOUNDATION_DOMAINS],
      lifecycle: [...PRODUCT_LIFECYCLE_ORDER],
      qualityGates: [...AVOS_QUALITY_GATES],
      standards: [...AVOS_FOUNDATION_STANDARDS],
    };
  }

  registerFoundation(
    input: Omit<FoundationMasterRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    const code = input.code.trim().toUpperCase();
    if (!code || this.foundationCodeIndex.has(code)) {
      throw new Error(`Invalid or duplicate foundation code: ${code}`);
    }
    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new Error("Foundation version must use semantic versioning");
    }

    for (const dependency of input.dependencies) {
      if (!this.foundationCodeIndex.has(dependency.toUpperCase())) {
        throw new Error(`Unknown foundation dependency: ${dependency}`);
      }
    }

    const now = new Date().toISOString();
    const record: FoundationMasterRecord = {
      ...input,
      id: randomUUID(),
      code,
      dependencies: [...input.dependencies],
      evidence: [...input.evidence],
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    this.foundations.set(record.id, record);
    this.foundationCodeIndex.set(code, record.id);
    return this.cloneFoundation(record);
  }

  createDecision(
    input: Omit<ArchitectureDecisionRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    const code = input.code.trim().toUpperCase();
    if (!code || this.decisionCodeIndex.has(code)) {
      throw new Error(`Invalid or duplicate ADR code: ${code}`);
    }

    const now = new Date().toISOString();
    const decision: ArchitectureDecisionRecord = {
      ...input,
      id: randomUUID(),
      code,
      consequences: [...input.consequences],
      status: "PROPOSED",
      createdAt: now,
      updatedAt: now,
    };

    this.decisions.set(decision.id, decision);
    this.decisionCodeIndex.set(code, decision.id);
    return this.cloneDecision(decision);
  }

  acceptDecision(id: string) {
    const decision = this.requireDecision(id);
    decision.status = "ACCEPTED";
    decision.updatedAt = new Date().toISOString();
    this.decisions.set(id, decision);
    return this.cloneDecision(decision);
  }

  registerProduct(input: { productName: string; owner: string }) {
    const now = new Date().toISOString();
    const qualityGates = Object.fromEntries(
      AVOS_QUALITY_GATES.map((gate) => [gate, false]),
    );

    const product: ProductLifecycleRecord = {
      id: randomUUID(),
      productName: input.productName.trim(),
      owner: input.owner.trim(),
      currentStage: "DISCOVERY",
      completedStages: [],
      foundationRecords: [],
      architectureDecisions: [],
      qualityGates,
      releaseApproved: false,
      createdAt: now,
      updatedAt: now,
    };

    if (!product.productName || !product.owner) {
      throw new Error("Product name and owner are required");
    }

    this.products.set(product.id, product);
    return this.cloneProduct(product);
  }

  attachFoundation(productId: string, foundationId: string) {
    const product = this.requireProduct(productId);
    this.requireFoundation(foundationId);

    if (!product.foundationRecords.includes(foundationId)) {
      product.foundationRecords.push(foundationId);
    }

    product.updatedAt = new Date().toISOString();
    this.products.set(productId, product);
    return this.cloneProduct(product);
  }

  attachDecision(productId: string, decisionId: string) {
    const product = this.requireProduct(productId);
    const decision = this.requireDecision(decisionId);

    if (decision.status !== "ACCEPTED") {
      throw new Error("Only accepted architecture decisions may be attached");
    }

    if (!product.architectureDecisions.includes(decisionId)) {
      product.architectureDecisions.push(decisionId);
    }

    product.updatedAt = new Date().toISOString();
    this.products.set(productId, product);
    return this.cloneProduct(product);
  }

  completeStage(productId: string, stage: LifecycleStage) {
    const product = this.requireProduct(productId);
    const index = PRODUCT_LIFECYCLE_ORDER.indexOf(stage);

    if (index < 0) {
      throw new Error(`Unknown lifecycle stage: ${stage}`);
    }

    const prerequisites = PRODUCT_LIFECYCLE_ORDER.slice(0, index);
    const missing = prerequisites.filter(
      (item) => !product.completedStages.includes(item),
    );

    if (missing.length > 0) {
      throw new Error(`Missing lifecycle stages: ${missing.join(", ")}`);
    }

    if (stage === "FOUNDATION" && product.foundationRecords.length === 0) {
      throw new Error("Foundation records are required");
    }

    if (stage === "ARCHITECTURE" && product.architectureDecisions.length === 0) {
      throw new Error("Accepted architecture decisions are required");
    }

    if (!product.completedStages.includes(stage)) {
      product.completedStages.push(stage);
    }

    product.currentStage = PRODUCT_LIFECYCLE_ORDER[index + 1] ?? stage;
    product.updatedAt = new Date().toISOString();
    this.products.set(productId, product);
    return this.cloneProduct(product);
  }

  updateQualityGate(productId: string, gate: string, passed: boolean) {
    const product = this.requireProduct(productId);

    if (!AVOS_QUALITY_GATES.includes(gate as never)) {
      throw new Error(`Unknown quality gate: ${gate}`);
    }

    product.qualityGates[gate] = passed;
    product.updatedAt = new Date().toISOString();
    this.products.set(productId, product);
    return this.cloneProduct(product);
  }

  evaluateRelease(productId: string) {
    const product = this.requireProduct(productId);
    const missingStages = PRODUCT_LIFECYCLE_ORDER
      .slice(0, PRODUCT_LIFECYCLE_ORDER.indexOf("RELEASE"))
      .filter((stage) => !product.completedStages.includes(stage));

    const failedGates = Object.entries(product.qualityGates)
      .filter(([, passed]) => !passed)
      .map(([gate]) => gate);

    const activeFoundations = product.foundationRecords.filter((id) => {
      const foundation = this.foundations.get(id);
      return foundation?.status === "ACTIVE";
    });

    const acceptedDecisions = product.architectureDecisions.filter((id) => {
      const decision = this.decisions.get(id);
      return decision?.status === "ACCEPTED";
    });

    const approved =
      missingStages.length === 0 &&
      failedGates.length === 0 &&
      activeFoundations.length > 0 &&
      acceptedDecisions.length > 0;

    product.releaseApproved = approved;
    product.updatedAt = new Date().toISOString();
    this.products.set(productId, product);

    return {
      productId,
      approved,
      missingStages,
      failedGates,
      activeFoundations: activeFoundations.length,
      acceptedDecisions: acceptedDecisions.length,
      evaluatedAt: new Date().toISOString(),
    };
  }

  commandCenter() {
    const products = Array.from(this.products.values());
    return {
      foundations: this.foundations.size,
      architectureDecisions: this.decisions.size,
      acceptedDecisions: Array.from(this.decisions.values()).filter(
        (item) => item.status === "ACCEPTED",
      ).length,
      products: products.length,
      releaseApproved: products.filter((item) => item.releaseApproved).length,
      generatedAt: new Date().toISOString(),
    };
  }

  listFoundations() {
    return Array.from(this.foundations.values()).map((item) =>
      this.cloneFoundation(item),
    );
  }

  listDecisions() {
    return Array.from(this.decisions.values()).map((item) =>
      this.cloneDecision(item),
    );
  }

  listProducts() {
    return Array.from(this.products.values()).map((item) =>
      this.cloneProduct(item),
    );
  }

  private requireFoundation(id: string) {
    const item = this.foundations.get(id);
    if (!item) throw new Error(`Foundation record not found: ${id}`);
    return item;
  }

  private requireDecision(id: string) {
    const item = this.decisions.get(id);
    if (!item) throw new Error(`Architecture decision not found: ${id}`);
    return item;
  }

  private requireProduct(id: string) {
    const item = this.products.get(id);
    if (!item) throw new Error(`Product lifecycle record not found: ${id}`);
    return item;
  }

  private cloneFoundation(item: FoundationMasterRecord): FoundationMasterRecord {
    return {
      ...item,
      dependencies: [...item.dependencies],
      evidence: [...item.evidence],
    };
  }

  private cloneDecision(item: ArchitectureDecisionRecord): ArchitectureDecisionRecord {
    return { ...item, consequences: [...item.consequences] };
  }

  private cloneProduct(item: ProductLifecycleRecord): ProductLifecycleRecord {
    return {
      ...item,
      completedStages: [...item.completedStages],
      foundationRecords: [...item.foundationRecords],
      architectureDecisions: [...item.architectureDecisions],
      qualityGates: { ...item.qualityGates },
    };
  }
}