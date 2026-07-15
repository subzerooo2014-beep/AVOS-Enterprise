import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ProductionLaunchService } from "./production-launch.service";
import {
  IncidentRecord,
  LaunchDomain,
  LaunchGate,
  RecoveryDrill,
} from "./production-launch.types";

@Controller("production-platform/launch")
export class ProductionLaunchController {
  constructor(private readonly launch: ProductionLaunchService) {}

  @Get("readiness")
  readiness() {
    return this.launch.getReadiness();
  }

  @Get("gates")
  gates() {
    return this.launch.listGates();
  }

  @Post("gates")
  evaluateGate(
    @Body()
    body: {
      name: string;
      domain: LaunchDomain;
      status: LaunchGate["status"];
      evidence?: string[];
      required?: boolean;
    },
  ) {
    return this.launch.evaluateGate(
      body.name,
      body.domain,
      body.status,
      body.evidence,
      body.required,
    );
  }

  @Get("incidents")
  incidents() {
    return this.launch.listIncidents();
  }

  @Post("incidents")
  createIncident(
    @Body() body: { title: string; severity: IncidentRecord["severity"] },
  ) {
    return this.launch.createIncident(body.title, body.severity);
  }

  @Patch("incidents/:id")
  updateIncident(
    @Param("id") id: string,
    @Body() body: { status: IncidentRecord["status"]; note: string },
  ) {
    return this.launch.updateIncident(id, body.status, body.note);
  }

  @Get("recovery-drills")
  recoveryDrills() {
    return this.launch.listRecoveryDrills();
  }

  @Post("recovery-drills")
  startRecoveryDrill(
    @Body()
    body: {
      type: RecoveryDrill["type"];
      recoveryPointObjectiveMinutes: number;
      recoveryTimeObjectiveMinutes: number;
    },
  ) {
    return this.launch.startRecoveryDrill(
      body.type,
      body.recoveryPointObjectiveMinutes,
      body.recoveryTimeObjectiveMinutes,
    );
  }

  @Patch("recovery-drills/:id/complete")
  completeRecoveryDrill(
    @Param("id") id: string,
    @Body() body: { passed: boolean; evidence?: string[] },
  ) {
    return this.launch.completeRecoveryDrill(
      id,
      body.passed,
      body.evidence,
    );
  }
}