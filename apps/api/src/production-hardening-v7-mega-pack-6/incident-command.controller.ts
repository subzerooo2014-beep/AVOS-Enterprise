import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { AddIncidentTimelineDto } from "./dto/add-incident-timeline.dto";
import { AssignIncidentMemberDto } from "./dto/assign-incident-member.dto";
import { CreateEnterpriseIncidentDto } from "./dto/create-enterprise-incident.dto";
import { CreateIncidentActionDto } from "./dto/create-incident-action.dto";
import { UpdateIncidentStatusDto } from "./dto/update-incident-status.dto";
import { UpdateOperationalStatusDto } from "./dto/update-operational-status.dto";
import { IncidentCommandService } from "./incident-command.service";
import {
  IncidentStatus,
} from "./types/mega-pack-6.types";

@Controller(
  "production-hardening-v7/mega-pack-6/incidents",
)
export class IncidentCommandController {
  constructor(
    private readonly incidents:
      IncidentCommandService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateEnterpriseIncidentDto,
  ) {
    return this.incidents.create(dto);
  }

  @Get()
  list(
    @Query("status")
    status?: IncidentStatus,
  ) {
    return this.incidents.list(
      status,
    );
  }

  @Get("summary")
  summary() {
    return this.incidents.summary();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.incidents.get(id);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateIncidentStatusDto & {
        actor?: string;
      },
  ) {
    return this.incidents.updateStatus(
      id,
      dto.status,
      dto.actor ?? "api",
    );
  }

  @Post(":id/team")
  assignMember(
    @Param("id")
    id: string,
    @Body()
    dto: AssignIncidentMemberDto,
  ) {
    return this.incidents.assignMember(
      id,
      dto,
    );
  }

  @Post(":id/timeline")
  addTimeline(
    @Param("id")
    id: string,
    @Body()
    dto: AddIncidentTimelineDto,
  ) {
    return this.incidents.addTimeline(
      id,
      dto,
    );
  }

  @Post(":id/actions")
  addAction(
    @Param("id")
    id: string,
    @Body()
    dto: CreateIncidentActionDto,
  ) {
    return this.incidents.addAction(
      id,
      dto,
    );
  }

  @Patch(
    ":incidentId/actions/:actionId/status",
  )
  updateActionStatus(
    @Param("incidentId")
    incidentId: string,
    @Param("actionId")
    actionId: string,
    @Body()
    dto:
      UpdateOperationalStatusDto & {
        actor?: string;
      },
  ) {
    return this.incidents
      .updateActionStatus(
        incidentId,
        actionId,
        dto.status,
        dto.actor ?? "api",
      );
  }
}
