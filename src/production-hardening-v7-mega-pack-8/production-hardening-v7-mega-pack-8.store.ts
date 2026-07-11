import {
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import {
  createHash,
  randomUUID,
} from "node:crypto";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import {
  ConfigurationEvidence,
  ConfigurationEvent,
  ConfigurationGovernanceState,
} from "./production-hardening-v7-mega-pack-8.types";

@Injectable()
export class ProductionHardeningV7MegaPack8Store
  implements OnModuleInit
{
  private readonly logger = new Logger(
    ProductionHardeningV7MegaPack8Store.name,
  );

  private readonly storageDirectory =
    path.resolve(
      process.cwd(),
      "runtime-data",
    );

  private readonly storageFile = path.join(
    this.storageDirectory,
    "production-hardening-v7-mega-pack-8.json",
  );

  private state =
    this.createInitialState();

  private writeQueue: Promise<void> =
    Promise.resolve();

  private readonly readyPromise: Promise<void>;

  private resolveReady!: () => void;

  constructor() {
    this.readyPromise =
      new Promise<void>((resolve) => {
        this.resolveReady = resolve;
      });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.load();
    } finally {
      this.resolveReady();
    }
  }

  async waitUntilReady(): Promise<void> {
    await this.readyPromise;
  }

  getSnapshot(): ConfigurationGovernanceState {
    return structuredClone(this.state);
  }

  async mutate(
    mutator: (
      state: ConfigurationGovernanceState,
    ) => void | Promise<void>,
  ): Promise<ConfigurationGovernanceState> {
    await mutator(this.state);

    this.state.updatedAt =
      new Date().toISOString();

    await this.persist();

    return this.getSnapshot();
  }

  async appendEvent(
    event: Omit<
      ConfigurationEvent,
      "id" | "createdAt"
    >,
  ): Promise<ConfigurationEvent> {
    const created: ConfigurationEvent = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...event,
    };

    await this.mutate((state) => {
      state.events.push(created);

      if (state.events.length > 5000) {
        state.events =
          state.events.slice(-5000);
      }
    });

    return created;
  }

  async appendEvidence(params: {
    evidenceType: string;
    entityType: string;
    entityId: string;
    payload: unknown;
  }): Promise<ConfigurationEvidence> {
    const previous =
      this.state.evidence.length > 0
        ? this.state.evidence[
            this.state.evidence.length - 1
          ]
        : null;

    const createdAt =
      new Date().toISOString();

    const payloadHash = this.hash(
      this.stableStringify(params.payload),
    );

    const chainHash = this.hash(
      [
        previous?.chainHash ?? "GENESIS",
        params.evidenceType,
        params.entityType,
        params.entityId,
        payloadHash,
        createdAt,
      ].join("|"),
    );

    const evidence: ConfigurationEvidence = {
      id: randomUUID(),
      evidenceType: params.evidenceType,
      entityType: params.entityType,
      entityId: params.entityId,
      payloadHash,
      previousHash:
        previous?.chainHash ?? null,
      chainHash,
      createdAt,
    };

    await this.mutate((state) => {
      state.evidence.push(evidence);

      if (state.evidence.length > 10000) {
        state.evidence =
          state.evidence.slice(-10000);
      }
    });

    return evidence;
  }

  verifyEvidenceChain(): {
    verified: boolean;
    checked: number;
    brokenAt: string | null;
  } {
    let previousHash: string | null = null;

    for (const evidence of this.state.evidence) {
      if (
        evidence.previousHash !== previousHash
      ) {
        return {
          verified: false,
          checked:
            this.state.evidence.length,
          brokenAt: evidence.id,
        };
      }

      previousHash = evidence.chainHash;
    }

    return {
      verified: true,
      checked: this.state.evidence.length,
      brokenAt: null,
    };
  }

  private async load(): Promise<void> {
    await fs.mkdir(
      this.storageDirectory,
      { recursive: true },
    );

    try {
      const raw = await fs.readFile(
        this.storageFile,
        "utf8",
      );

      const parsed = JSON.parse(
        raw,
      ) as Partial<ConfigurationGovernanceState>;

      this.state =
        this.normalizeState(parsed);

      this.logger.log(
        `Configuration governance state loaded: ${this.storageFile}`,
      );
    } catch (error) {
      const nodeError =
        error as NodeJS.ErrnoException;

      if (nodeError.code !== "ENOENT") {
        this.logger.warn(
          `Unable to load state: ${nodeError.message}`,
        );
      }

      this.state =
        this.createInitialState();

      await this.persist();

      this.logger.log(
        `Configuration governance state initialized: ${this.storageFile}`,
      );
    }
  }

  private async persist(): Promise<void> {
    const snapshot = JSON.stringify(
      this.state,
      null,
      2,
    );

    this.writeQueue =
      this.writeQueue.then(async () => {
        await fs.mkdir(
          this.storageDirectory,
          { recursive: true },
        );

        await fs.writeFile(
          this.storageFile,
          snapshot,
          "utf8",
        );
      });

    await this.writeQueue;
  }

  private createInitialState():
    ConfigurationGovernanceState {
    const now = new Date().toISOString();

    return {
      version: "v7-mega-pack-8",
      initializedAt: now,
      updatedAt: now,
      configurations: [],
      baselines: [],
      policies: [],
      evaluations: [],
      featureFlags: [],
      drifts: [],
      approvals: [],
      killSwitches: [],
      rollbacks: [],
      evidence: [],
      events: [],
    };
  }

  private normalizeState(
    input:
      Partial<ConfigurationGovernanceState>,
  ): ConfigurationGovernanceState {
    const initial =
      this.createInitialState();

    return {
      ...initial,
      ...input,
      configurations:
        Array.isArray(input.configurations)
          ? input.configurations
          : [],
      baselines:
        Array.isArray(input.baselines)
          ? input.baselines
          : [],
      policies:
        Array.isArray(input.policies)
          ? input.policies
          : [],
      evaluations:
        Array.isArray(input.evaluations)
          ? input.evaluations
          : [],
      featureFlags:
        Array.isArray(input.featureFlags)
          ? input.featureFlags
          : [],
      drifts:
        Array.isArray(input.drifts)
          ? input.drifts
          : [],
      approvals:
        Array.isArray(input.approvals)
          ? input.approvals
          : [],
      killSwitches:
        Array.isArray(input.killSwitches)
          ? input.killSwitches
          : [],
      rollbacks:
        Array.isArray(input.rollbacks)
          ? input.rollbacks
          : [],
      evidence:
        Array.isArray(input.evidence)
          ? input.evidence
          : [],
      events:
        Array.isArray(input.events)
          ? input.events
          : [],
    };
  }

  private hash(value: string): string {
    return createHash("sha256")
      .update(value)
      .digest("hex");
  }

  private stableStringify(
    value: unknown,
  ): string {
    const normalize = (
      item: unknown,
    ): unknown => {
      if (Array.isArray(item)) {
        return item.map(normalize);
      }

      if (
        item &&
        typeof item === "object" &&
        !(item instanceof Date)
      ) {
        return Object.fromEntries(
          Object.entries(
            item as Record<string, unknown>,
          )
            .sort(([left], [right]) =>
              left.localeCompare(right),
            )
            .map(([key, nested]) => [
              key,
              normalize(nested),
            ]),
        );
      }

      return item;
    };

    return JSON.stringify(
      normalize(value),
    );
  }
}

