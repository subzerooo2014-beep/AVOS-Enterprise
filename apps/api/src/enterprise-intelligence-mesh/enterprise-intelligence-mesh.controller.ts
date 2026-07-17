import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import type {
  MeshNodeStatus,
  MeshRouteKind
} from "./contracts/enterprise-intelligence-mesh.contracts";
import {
  ExecuteMeshRequestDto,
  PublishMeshEventDto,
  RegisterMeshNodeDto
} from "./dto/enterprise-intelligence-mesh.dto";
import { EnterpriseIntelligenceMeshService } from "./services/enterprise-intelligence-mesh.service";

@Controller("avos/enterprise-intelligence-mesh")
export class EnterpriseIntelligenceMeshController {
  constructor(
    private readonly mesh: EnterpriseIntelligenceMeshService
  ) {}

  @Get("status")
  status() {
    return this.mesh.status();
  }

  @Get("health")
  health() {
    return this.mesh.health();
  }

  @Get("metrics")
  metrics() {
    return this.mesh.metrics();
  }

  @Get("nodes")
  nodes(@Query("kind") kind?: MeshRouteKind) {
    return this.mesh.nodes(kind);
  }

  @Post("nodes")
  register(@Body() dto: RegisterMeshNodeDto) {
    return this.mesh.register(dto);
  }

  @Post("nodes/:id/heartbeat")
  heartbeat(
    @Param("id") id: string,
    @Body("status") status: MeshNodeStatus = "online"
  ) {
    return this.mesh.heartbeat(id, status);
  }

  @Get("graph")
  graph() {
    return this.mesh.graph();
  }

  @Post("execute")
  execute(@Body() dto: ExecuteMeshRequestDto) {
    return this.mesh.execute(dto);
  }

  @Get("requests")
  requests() {
    return this.mesh.requests();
  }

  @Get("requests/:id")
  request(@Param("id") id: string) {
    return this.mesh.request(id);
  }

  @Get("results")
  results() {
    return this.mesh.results();
  }

  @Post("events")
  publish(@Body() dto: PublishMeshEventDto) {
    return this.mesh.publish(dto);
  }

  @Get("events")
  events(@Query("topic") topic?: string) {
    return this.mesh.eventList(topic);
  }

  @Post("final-review/run")
  finalReview() {
    return this.mesh.finalReview();
  }

  @Post("certification/certify")
  certify() {
    return this.mesh.certify();
  }

  @Get("certification/status")
  certificationStatus() {
    return {
      review: this.mesh.finalReview(),
      certification: this.mesh.certify(),
      health: this.mesh.health()
    };
  }
}