import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ECOSYSTEM_CAPABILITIES } from "./ecosystem-platform.registry";
import {
  EcosystemApplication,
  EcosystemCapability,
  EcosystemCredential,
  EcosystemExecution,
} from "./ecosystem-platform.types";

@Injectable()
export class EcosystemPlatformService {
  private readonly applications = new Map<string, EcosystemApplication>();
  private readonly credentials = new Map<string, EcosystemCredential>();
  private readonly executions = new Map<string, EcosystemExecution>();
  private readonly codeIndex = new Map<string, string>();

  framework() {
    return {
      system: "AVOS Ecosystem Platform Pack V1",
      status: "READY",
      capabilityCount: Object.keys(ECOSYSTEM_CAPABILITIES).length,
      capabilities: structuredClone(ECOSYSTEM_CAPABILITIES),
    };
  }

  registerApplication(
    capability: EcosystemCapability,
    input: Omit<
      EcosystemApplication,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    if (!ECOSYSTEM_CAPABILITIES[capability]) {
      throw new Error(`Unknown ecosystem capability: ${capability}`);
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new Error("Application version must use semantic versioning");
    }

    const code = `${capability}:${input.code.trim().toUpperCase()}`;

    if (this.codeIndex.has(code)) {
      throw new Error(`Duplicate ecosystem application code: ${code}`);
    }

    const now = new Date().toISOString();

    const application: EcosystemApplication = {
      ...input,
      id: randomUUID(),
      capability,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      owner: input.owner.trim(),
      status: "DRAFT",
      configuration: { ...input.configuration },
      createdAt: now,
      updatedAt: now,
    };

    if (!application.name || !application.owner) {
      throw new Error("Application name and owner are required");
    }

    this.applications.set(application.id, application);
    this.codeIndex.set(code, application.id);

    return this.cloneApplication(application);
  }

  activateApplication(id: string) {
    const application = this.requireApplication(id);
    application.status = "ACTIVE";
    application.updatedAt = new Date().toISOString();
    this.applications.set(id, application);

    return this.cloneApplication(application);
  }

  issueCredential(
    applicationId: string,
    input: {
      credentialType: EcosystemCredential["credentialType"];
      label: string;
    },
  ) {
    const application = this.requireApplication(applicationId);

    if (application.status !== "ACTIVE") {
      throw new Error("Application must be active before issuing credentials");
    }

    const rawSecret = randomUUID().replaceAll("-", "");
    const credential: EcosystemCredential = {
      id: randomUUID(),
      applicationId,
      credentialType: input.credentialType,
      label: input.label.trim(),
      maskedValue: `${rawSecret.slice(0, 4)}****${rawSecret.slice(-4)}`,
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.credentials.set(credential.id, credential);
    return { ...credential };
  }

  rotateCredential(id: string) {
    const credential = this.requireCredential(id);
    const rawSecret = randomUUID().replaceAll("-", "");

    credential.maskedValue = `${rawSecret.slice(0, 4)}****${rawSecret.slice(-4)}`;
    credential.rotatedAt = new Date().toISOString();
    credential.active = true;

    this.credentials.set(id, credential);
    return { ...credential };
  }

  execute(
    capability: EcosystemCapability,
    input: {
      applicationId: string;
      action: string;
      payload: Record<string, string | number | boolean>;
    },
  ) {
    const application = this.requireApplication(input.applicationId);

    if (application.capability !== capability) {
      throw new Error("Application capability does not match execution capability");
    }

    if (application.status !== "ACTIVE") {
      throw new Error("Application must be active before execution");
    }

    const now = new Date().toISOString();

    const execution: EcosystemExecution = {
      id: randomUUID(),
      applicationId: application.id,
      capability,
      action: input.action.trim(),
      status: "COMPLETED",
      payload: { ...input.payload },
      result: {
        success: true,
        capability,
        action: input.action.trim(),
      },
      createdAt: now,
      completedAt: now,
    };

    this.executions.set(execution.id, execution);
    return this.cloneExecution(execution);
  }

  listApplications(
    capability?: EcosystemCapability,
    tenantId?: string,
  ) {
    return Array.from(this.applications.values())
      .filter((item) => !capability || item.capability === capability)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.cloneApplication(item));
  }

  commandCenter() {
    const applications = Array.from(this.applications.values());
    const credentials = Array.from(this.credentials.values());
    const executions = Array.from(this.executions.values());

    return {
      system: "AVOS Ecosystem Platform Pack V1",
      capabilities: Object.keys(ECOSYSTEM_CAPABILITIES).length,
      applications: applications.length,
      activeApplications: applications.filter(
        (item) => item.status === "ACTIVE",
      ).length,
      credentials: credentials.length,
      activeCredentials: credentials.filter((item) => item.active).length,
      executions: executions.length,
      completedExecutions: executions.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireApplication(id: string) {
    const application = this.applications.get(id);

    if (!application) {
      throw new Error(`Ecosystem application not found: ${id}`);
    }

    return application;
  }

  private requireCredential(id: string) {
    const credential = this.credentials.get(id);

    if (!credential) {
      throw new Error(`Ecosystem credential not found: ${id}`);
    }

    return credential;
  }

  private cloneApplication(
    application: EcosystemApplication,
  ): EcosystemApplication {
    return {
      ...application,
      configuration: { ...application.configuration },
    };
  }

  private cloneExecution(
    execution: EcosystemExecution,
  ): EcosystemExecution {
    return {
      ...execution,
      payload: { ...execution.payload },
      result: execution.result ? { ...execution.result } : undefined,
    };
  }
}