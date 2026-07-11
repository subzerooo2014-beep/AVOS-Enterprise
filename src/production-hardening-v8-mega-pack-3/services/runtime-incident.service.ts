import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  JsonValue,
  RuntimeIncident,
  RuntimeIncidentTimelineEntry,
} from "../contracts/runtime-resilience.contracts";
import {
  EvidenceEntryType,
  RuntimeIncidentStatus,
} from "../contracts/runtime-resilience.enums";
import {
  CreateRuntimeIncidentDto,
  UpdateRuntimeIncidentDto,
} from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";

@Injectable()
export class RuntimeIncidentService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
  ) {}

  create(dto: CreateRuntimeIncidentDto): RuntimeIncident {
    this.validateSignalReferences(dto.signalIds ?? []);
    this.validateConfigurationReferences(
      dto.configurationIds ?? [],
    );

    const now = new Date().toISOString();

    const initialTimeline: RuntimeIncidentTimelineEntry = {
      id: randomUUID(),
      status: RuntimeIncidentStatus.OPEN,
      message: "Runtime incident created",
      actor: dto.actor,
      createdAt: now,
      metadata: {},
    };

    const incident: RuntimeIncident = {
      id: randomUUID(),
      incidentNumber: this.nextIncidentNumber(),
      title: dto.title,
      description: dto.description,
      environment: dto.environment,
      namespace: dto.namespace,
      service: dto.service,
      severity: dto.severity,
      status: RuntimeIncidentStatus.OPEN,
      riskLevel: dto.riskLevel,
      signalIds: dto.signalIds ?? [],
      configurationIds: dto.configurationIds ?? [],
      actionIds: [],
      owner: dto.actor,
      tags: dto.tags ?? [],
      timeline: [initialTimeline],
      detectedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const saved = this.store.saveIncident(incident);

    this.evidence.append({
      type: EvidenceEntryType.INCIDENT_CREATED,
      aggregateType: "runtime_incident",
      aggregateId: saved.id,
      actor: dto.actor,
      payload: {
        incidentId: saved.id,
        incidentNumber: saved.incidentNumber,
        title: saved.title,
        environment: saved.environment,
        namespace: saved.namespace,
        service: saved.service ?? null,
        severity: saved.severity,
        status: saved.status,
        riskLevel: saved.riskLevel,
        signalIds: saved.signalIds,
        configurationIds: saved.configurationIds,
      },
    });

    return saved;
  }

  list(filters?: {
    status?: RuntimeIncidentStatus;
    environment?: string;
    namespace?: string;
    service?: string;
  }): RuntimeIncident[] {
    return this.store.listIncidents().filter((incident) => {
      if (
        filters?.status &&
        incident.status !== filters.status
      ) {
        return false;
      }

      if (
        filters?.environment &&
        incident.environment !== filters.environment
      ) {
        return false;
      }

      if (
        filters?.namespace &&
        incident.namespace !== filters.namespace
      ) {
        return false;
      }

      if (
        filters?.service &&
        incident.service !== filters.service
      ) {
        return false;
      }

      return true;
    });
  }

  get(id: string): RuntimeIncident {
    const incident = this.store.getIncident(id);

    if (!incident) {
      throw new NotFoundException(
        `Runtime incident ${id} was not found`,
      );
    }

    return incident;
  }

  update(
    id: string,
    dto: UpdateRuntimeIncidentDto,
  ): RuntimeIncident {
    const incident = this.get(id);
    const now = new Date().toISOString();

    this.validateStatusTransition(
      incident.status,
      dto.status,
    );

    incident.status = dto.status;
    incident.updatedAt = now;

    if (
      dto.status === RuntimeIncidentStatus.INVESTIGATING &&
      !incident.acknowledgedAt
    ) {
      incident.acknowledgedAt = now;
    }

    if (dto.status === RuntimeIncidentStatus.RESOLVED) {
      incident.resolvedAt = now;
    }

    if (dto.status === RuntimeIncidentStatus.CLOSED) {
      incident.closedAt = now;
    }

    incident.timeline.push({
      id: randomUUID(),
      status: dto.status,
      message: dto.message,
      actor: dto.actor,
      createdAt: now,
      metadata: (dto.metadata ?? {}) as Record<
        string,
        JsonValue
      >,
    });

    const saved = this.store.saveIncident(incident);

    this.evidence.append({
      type: EvidenceEntryType.INCIDENT_UPDATED,
      aggregateType: "runtime_incident",
      aggregateId: saved.id,
      actor: dto.actor,
      payload: {
        incidentId: saved.id,
        status: saved.status,
        message: dto.message,
        metadata: (dto.metadata ?? {}) as Record<
          string,
          JsonValue
        >,
      },
    });

    return saved;
  }

  attachAction(
    incidentId: string,
    actionId: string,
  ): RuntimeIncident {
    const incident = this.get(incidentId);

    if (!incident.actionIds.includes(actionId)) {
      incident.actionIds.push(actionId);
      incident.updatedAt = new Date().toISOString();
    }

    return this.store.saveIncident(incident);
  }

  private nextIncidentNumber(): string {
    const next = this.store.listIncidents().length + 1;

    return `AVOS-INC-${String(next).padStart(6, "0")}`;
  }

  private validateSignalReferences(signalIds: string[]): void {
    for (const signalId of signalIds) {
      if (!this.store.getSignal(signalId)) {
        throw new NotFoundException(
          `Referenced runtime signal ${signalId} was not found`,
        );
      }
    }
  }

  private validateConfigurationReferences(
    configurationIds: string[],
  ): void {
    for (const configurationId of configurationIds) {
      if (!this.store.getConfiguration(configurationId)) {
        throw new NotFoundException(
          `Referenced resilience configuration ${configurationId} was not found`,
        );
      }
    }
  }

  private validateStatusTransition(
    current: RuntimeIncidentStatus,
    next: RuntimeIncidentStatus,
  ): void {
    if (current === next) {
      return;
    }

    const transitions: Record<
      RuntimeIncidentStatus,
      RuntimeIncidentStatus[]
    > = {
      [RuntimeIncidentStatus.OPEN]: [
        RuntimeIncidentStatus.INVESTIGATING,
        RuntimeIncidentStatus.MITIGATING,
        RuntimeIncidentStatus.RESOLVED,
      ],
      [RuntimeIncidentStatus.INVESTIGATING]: [
        RuntimeIncidentStatus.MITIGATING,
        RuntimeIncidentStatus.MONITORING,
        RuntimeIncidentStatus.RESOLVED,
      ],
      [RuntimeIncidentStatus.MITIGATING]: [
        RuntimeIncidentStatus.INVESTIGATING,
        RuntimeIncidentStatus.MONITORING,
        RuntimeIncidentStatus.RESOLVED,
      ],
      [RuntimeIncidentStatus.MONITORING]: [
        RuntimeIncidentStatus.INVESTIGATING,
        RuntimeIncidentStatus.MITIGATING,
        RuntimeIncidentStatus.RESOLVED,
      ],
      [RuntimeIncidentStatus.RESOLVED]: [
        RuntimeIncidentStatus.MONITORING,
        RuntimeIncidentStatus.CLOSED,
      ],
      [RuntimeIncidentStatus.CLOSED]: [],
    };

    if (!transitions[current].includes(next)) {
      throw new BadRequestException(
        `Invalid incident status transition from ${current} to ${next}`,
      );
    }
  }
}
