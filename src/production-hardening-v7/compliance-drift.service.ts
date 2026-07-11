import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  createHash,
  randomUUID,
} from "node:crypto";
import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateDriftEventDto } from "./dto/create-drift-event.dto";
import {
  ComplianceDriftEvent,
} from "./types/production-hardening-v7.types";

@Injectable()
export class ComplianceDriftService {
  private readonly collection = "compliance-drift-events";

  constructor(
    private readonly storage: AssuranceStorageService,
  ) {}

  async detect(
    dto: CreateDriftEventDto,
  ): Promise<ComplianceDriftEvent> {
    const fingerprint = this.createFingerprint({
      domain: dto.domain,
      resource: dto.resource,
      previousState: dto.previousState,
      currentState: dto.currentState,
    });

    const events =
      await this.storage.readCollection<ComplianceDriftEvent>(
        this.collection,
      );

    const activeDuplicate = events.find(
      (event) =>
        event.fingerprint === fingerprint &&
        event.status !== "resolved" &&
        event.status !== "ignored",
    );

    if (activeDuplicate) {
      return activeDuplicate;
    }

    const now = new Date().toISOString();

    const event: ComplianceDriftEvent = {
      id: randomUUID(),
      fingerprint,
      domain: dto.domain,
      resource: dto.resource,
      previousState: dto.previousState,
      currentState: dto.currentState,
      severity: dto.severity,
      status: "open",
      detectedAt: now,
      description: dto.description,
      createdAt: now,
      updatedAt: now,
    };

    events.push(event);

    await this.storage.writeCollection(
      this.collection,
      events,
    );

    return event;
  }

  async list(
    status?: ComplianceDriftEvent["status"],
  ): Promise<ComplianceDriftEvent[]> {
    const events =
      await this.storage.readCollection<ComplianceDriftEvent>(
        this.collection,
      );

    return events
      .filter((event) => !status || event.status === status)
      .sort((a, b) =>
        b.detectedAt.localeCompare(a.detectedAt),
      );
  }

  async updateStatus(
    id: string,
    status: ComplianceDriftEvent["status"],
  ): Promise<ComplianceDriftEvent> {
    const existing =
      await this.storage.findById<ComplianceDriftEvent>(
        this.collection,
        id,
      );

    if (!existing) {
      throw new NotFoundException(
        `Compliance drift event ${id} was not found`,
      );
    }

    const now = new Date().toISOString();

    const updated: ComplianceDriftEvent = {
      ...existing,
      status,
      resolvedAt:
        status === "resolved" ? now : existing.resolvedAt,
      updatedAt: now,
    };

    await this.storage.replaceById(
      this.collection,
      id,
      updated,
    );

    return updated;
  }

  async summary(): Promise<{
    total: number;
    open: number;
    acknowledged: number;
    resolved: number;
    ignored: number;
    criticalOpen: number;
  }> {
    const events = await this.list();

    return {
      total: events.length,
      open: events.filter(
        (event) => event.status === "open",
      ).length,
      acknowledged: events.filter(
        (event) => event.status === "acknowledged",
      ).length,
      resolved: events.filter(
        (event) => event.status === "resolved",
      ).length,
      ignored: events.filter(
        (event) => event.status === "ignored",
      ).length,
      criticalOpen: events.filter(
        (event) =>
          event.status === "open" &&
          event.severity === "critical",
      ).length,
    };
  }

  private createFingerprint(value: unknown): string {
    return createHash("sha256")
      .update(this.stableStringify(value))
      .digest("hex");
  }

  private stableStringify(value: unknown): string {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value
        .map((item) => this.stableStringify(item))
        .join(",")}]`;
    }

    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();

    return `{${keys
      .map(
        (key) =>
          `${JSON.stringify(key)}:${this.stableStringify(
            record[key],
          )}`,
      )
      .join(",")}}`;
  }
}
