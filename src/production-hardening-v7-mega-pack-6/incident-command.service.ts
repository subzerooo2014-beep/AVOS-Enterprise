import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  INCIDENT_CODE_PREFIX,
  MEGA_PACK_6_COLLECTIONS,
} from "./constants/mega-pack-6.constants";
import { AddIncidentTimelineDto } from "./dto/add-incident-timeline.dto";
import { AssignIncidentMemberDto } from "./dto/assign-incident-member.dto";
import { CreateEnterpriseIncidentDto } from "./dto/create-enterprise-incident.dto";
import { CreateIncidentActionDto } from "./dto/create-incident-action.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import {
  EnterpriseIncident,
  IncidentAction,
  IncidentStatus,
  OperationalStatus,
} from "./types/mega-pack-6.types";

@Injectable()
export class IncidentCommandService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly sequence:
      EnterpriseSequenceService,
    private readonly events:
      PlatformEventBusService,
  ) {}

  async create(
    dto: CreateEnterpriseIncidentDto,
  ): Promise<EnterpriseIncident> {
    const now =
      new Date().toISOString();

    const incident: EnterpriseIncident = {
      id: randomUUID(),
      incidentCode:
        this.sequence.next(
          INCIDENT_CODE_PREFIX,
        ),
      title: dto.title,
      description: dto.description,
      severity: dto.severity,
      status: "detected",
      source: dto.source,
      detectedAt:
        dto.detectedAt ?? now,
      commander: dto.commander,
      commandTeam:
        dto.commander
          ? [
              {
                id: randomUUID(),
                person: dto.commander,
                role:
                  "incident_commander",
                assignedAt: now,
                active: true,
              },
            ]
          : [],
      affectedServices:
        dto.affectedServices ?? [],
      businessImpact:
        dto.businessImpact,
      technicalImpact:
        dto.technicalImpact,
      regulatoryImpact:
        dto.regulatoryImpact,
      evidenceReferences:
        dto.evidenceReferences ?? [],
      timeline: [
        {
          id: randomUUID(),
          timestamp: now,
          eventType:
            "incident_detected",
          description:
            "Enterprise incident record created",
          actor: dto.source,
          metadata: {},
        },
      ],
      actions: [],
      metadata: dto.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.append(
      MEGA_PACK_6_COLLECTIONS.enterpriseIncidents,
      incident,
    );

    await this.events.publish({
      eventType: "incident.detected",
      source:
        "IncidentCommandService",
      severity: incident.severity,
      entityType:
        "enterprise_incident",
      entityId: incident.id,
      payload: {
        incidentCode:
          incident.incidentCode,
        title: incident.title,
        affectedServices:
          incident.affectedServices,
      },
    });

    return incident;
  }

  async list(
    status?: IncidentStatus,
  ): Promise<EnterpriseIncident[]> {
    const incidents =
      await this.storage.readCollection<EnterpriseIncident>(
        MEGA_PACK_6_COLLECTIONS.enterpriseIncidents,
      );

    return incidents
      .filter(
        (incident) =>
          !status ||
          incident.status === status,
      )
      .sort((a, b) =>
        b.detectedAt.localeCompare(
          a.detectedAt,
        ),
      );
  }

  async get(
    id: string,
  ): Promise<EnterpriseIncident> {
    const incident =
      await this.storage.findById<EnterpriseIncident>(
        MEGA_PACK_6_COLLECTIONS.enterpriseIncidents,
        id,
      );

    if (!incident) {
      throw new NotFoundException(
        `Enterprise incident ${id} was not found`,
      );
    }

    return incident;
  }

  async updateStatus(
    id: string,
    status: IncidentStatus,
    actor = "system",
  ): Promise<EnterpriseIncident> {
    const incident = await this.get(id);

    this.validateStatusTransition(
      incident.status,
      status,
    );

    const now =
      new Date().toISOString();

    const timeline = [
      ...incident.timeline,
      {
        id: randomUUID(),
        timestamp: now,
        eventType:
          "incident_status_changed",
        description:
          `Incident status changed from ${incident.status} to ${status}`,
        actor,
        metadata: {
          previousStatus:
            incident.status,
          currentStatus: status,
        },
      },
    ];

    const updated: EnterpriseIncident = {
      ...incident,
      status,
      declaredAt:
        status === "declared"
          ? incident.declaredAt ?? now
          : incident.declaredAt,
      containedAt:
        status === "contained"
          ? incident.containedAt ?? now
          : incident.containedAt,
      resolvedAt:
        status === "resolved"
          ? incident.resolvedAt ?? now
          : incident.resolvedAt,
      closedAt:
        status === "closed"
          ? incident.closedAt ?? now
          : incident.closedAt,
      timeline,
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.enterpriseIncidents,
      id,
      updated,
    );

    await this.events.publish({
      eventType:
        `incident.${status}`,
      source:
        "IncidentCommandService",
      severity: incident.severity,
      entityType:
        "enterprise_incident",
      entityId: id,
      payload: {
        incidentCode:
          incident.incidentCode,
        previousStatus:
          incident.status,
        currentStatus: status,
        actor,
      },
    });

    return updated;
  }

  async assignMember(
    id: string,
    dto: AssignIncidentMemberDto,
  ): Promise<EnterpriseIncident> {
    const incident = await this.get(id);

    const alreadyActive =
      incident.commandTeam.some(
        (member) =>
          member.person === dto.person &&
          member.role === dto.role &&
          member.active,
      );

    if (alreadyActive) {
      return incident;
    }

    const now =
      new Date().toISOString();

    let commandTeam =
      incident.commandTeam;

    if (
      dto.role ===
      "incident_commander"
    ) {
      commandTeam =
        commandTeam.map((member) =>
          member.role ===
          "incident_commander"
            ? {
                ...member,
                active: false,
              }
            : member,
        );
    }

    commandTeam = [
      ...commandTeam,
      {
        id: randomUUID(),
        person: dto.person,
        role: dto.role,
        assignedAt: now,
        active: true,
      },
    ];

    const updated: EnterpriseIncident = {
      ...incident,
      commander:
        dto.role ===
        "incident_commander"
          ? dto.person
          : incident.commander,
      commandTeam,
      timeline: [
        ...incident.timeline,
        {
          id: randomUUID(),
          timestamp: now,
          eventType:
            "command_member_assigned",
          description:
            `${dto.person} assigned as ${dto.role}`,
          actor: "system",
          metadata: {
            person: dto.person,
            role: dto.role,
          },
        },
      ],
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.enterpriseIncidents,
      id,
      updated,
    );

    return updated;
  }

  async addTimeline(
    id: string,
    dto: AddIncidentTimelineDto,
  ): Promise<EnterpriseIncident> {
    const incident = await this.get(id);

    const now =
      new Date().toISOString();

    const updated: EnterpriseIncident = {
      ...incident,
      timeline: [
        ...incident.timeline,
        {
          id: randomUUID(),
          timestamp: now,
          eventType: dto.eventType,
          description:
            dto.description,
          actor: dto.actor,
          metadata:
            dto.metadata ?? {},
        },
      ],
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.enterpriseIncidents,
      id,
      updated,
    );

    return updated;
  }

  async addAction(
    id: string,
    dto: CreateIncidentActionDto,
  ): Promise<EnterpriseIncident> {
    const incident = await this.get(id);

    const now =
      new Date().toISOString();

    const action: IncidentAction = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      owner: dto.owner,
      status: "planned",
      priority: dto.priority,
      dueAt: dto.dueAt,
      dependencies:
        dto.dependencies ?? [],
      evidenceReferences:
        dto.evidenceReferences ?? [],
    };

    const updated: EnterpriseIncident = {
      ...incident,
      actions: [
        ...incident.actions,
        action,
      ],
      timeline: [
        ...incident.timeline,
        {
          id: randomUUID(),
          timestamp: now,
          eventType:
            "incident_action_created",
          description:
            `Incident action created: ${action.title}`,
          actor: dto.owner,
          metadata: {
            actionId: action.id,
            priority: action.priority,
          },
        },
      ],
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.enterpriseIncidents,
      id,
      updated,
    );

    return updated;
  }

  async updateActionStatus(
    incidentId: string,
    actionId: string,
    status: OperationalStatus,
    actor = "system",
  ): Promise<EnterpriseIncident> {
    const incident =
      await this.get(incidentId);

    const action =
      incident.actions.find(
        (item) => item.id === actionId,
      );

    if (!action) {
      throw new NotFoundException(
        `Incident action ${actionId} was not found`,
      );
    }

    const now =
      new Date().toISOString();

    const actions =
      incident.actions.map((item) =>
        item.id === actionId
          ? {
              ...item,
              status,
              completedAt:
                status === "completed"
                  ? now
                  : item.completedAt,
            }
          : item,
      );

    const updated: EnterpriseIncident = {
      ...incident,
      actions,
      timeline: [
        ...incident.timeline,
        {
          id: randomUUID(),
          timestamp: now,
          eventType:
            "incident_action_status_changed",
          description:
            `Action ${action.title} changed to ${status}`,
          actor,
          metadata: {
            actionId,
            status,
          },
        },
      ],
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.enterpriseIncidents,
      incidentId,
      updated,
    );

    return updated;
  }

  async summary(): Promise<{
    total: number;
    open: number;
    criticalOpen: number;
    declared: number;
    recovering: number;
    resolved: number;
  }> {
    const incidents = await this.list();

    const open = incidents.filter(
      (incident) =>
        !["resolved", "closed"].includes(
          incident.status,
        ),
    );

    return {
      total: incidents.length,
      open: open.length,
      criticalOpen: open.filter(
        (incident) =>
          incident.severity ===
          "critical",
      ).length,
      declared: incidents.filter(
        (incident) =>
          incident.status ===
          "declared",
      ).length,
      recovering: incidents.filter(
        (incident) =>
          incident.status ===
          "recovering",
      ).length,
      resolved: incidents.filter(
        (incident) =>
          ["resolved", "closed"].includes(
            incident.status,
          ),
      ).length,
    };
  }

  private validateStatusTransition(
    current: IncidentStatus,
    target: IncidentStatus,
  ): void {
    const transitions:
      Record<
        IncidentStatus,
        IncidentStatus[]
      > = {
        detected: [
          "triaged",
          "declared",
          "closed",
        ],
        triaged: [
          "declared",
          "contained",
          "closed",
        ],
        declared: [
          "contained",
          "recovering",
          "resolved",
        ],
        contained: [
          "recovering",
          "resolved",
        ],
        recovering: [
          "contained",
          "resolved",
        ],
        resolved: [
          "closed",
          "recovering",
        ],
        closed: [],
      };

    if (
      current !== target &&
      !transitions[current].includes(
        target,
      )
    ) {
      throw new BadRequestException(
        `Invalid incident transition from ${current} to ${target}`,
      );
    }
  }
}
