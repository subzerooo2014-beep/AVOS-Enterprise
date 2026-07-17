import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import {
  CreateKnowledgeEntityDto,
  CreateKnowledgeRelationDto,
  KnowledgeSearchDto,
  UpdateKnowledgeEntityDto,
} from "./dto/enterprise-knowledge-graph.dto";
import { KnowledgeEntityRegistryService } from "./services/knowledge-entity-registry.service";
import { KnowledgeGraphAnalysisService } from "./services/knowledge-graph-analysis.service";
import { KnowledgeGraphCertificationService } from "./services/knowledge-graph-certification.service";
import { KnowledgeQueryService } from "./services/knowledge-query.service";
import { KnowledgeRelationRegistryService } from "./services/knowledge-relation-registry.service";

@Controller("avos/enterprise-knowledge-graph")
export class EnterpriseKnowledgeGraphController {
  constructor(
    private readonly entities: KnowledgeEntityRegistryService,
    private readonly relations: KnowledgeRelationRegistryService,
    private readonly queryService: KnowledgeQueryService,
    private readonly analysis: KnowledgeGraphAnalysisService,
    private readonly certification: KnowledgeGraphCertificationService,
  ) {}

  @Get("health")
  health() {
    return this.analysis.health();
  }

  @Get("graph")
  graph() {
    return this.queryService.graph();
  }

  @Get("entities")
  listEntities() {
    return this.entities.list();
  }

  @Post("entities")
  createEntity(@Body() body: CreateKnowledgeEntityDto) {
    return this.entities.create(body);
  }

  @Get("entities/:id")
  getEntity(@Param("id") id: string) {
    return this.entities.get(id);
  }

  @Patch("entities/:id")
  updateEntity(@Param("id") id: string, @Body() body: UpdateKnowledgeEntityDto) {
    return this.entities.update(id, body);
  }

  @Post("search")
  search(@Body() body: KnowledgeSearchDto) {
    return this.entities.search(body);
  }

  @Get("relations")
  listRelations() {
    return this.relations.list();
  }

  @Post("relations")
  createRelation(@Body() body: CreateKnowledgeRelationDto) {
    return this.relations.create(body);
  }

  @Get("neighborhood/:entityId")
  neighborhood(
    @Param("entityId") entityId: string,
    @Query("depth") depth?: string,
  ) {
    const parsedDepth = depth ? Number(depth) : 1;
    return this.queryService.neighborhood(
      entityId,
      Number.isFinite(parsedDepth) ? parsedDepth : 1,
    );
  }

  @Get("path")
  findPath(
    @Query("sourceId") sourceId: string,
    @Query("targetId") targetId: string,
  ) {
    return this.queryService.findPath(sourceId, targetId);
  }

  @Get("insights")
  insights() {
    return this.analysis.insights();
  }

  @Post("final-review/run")
  finalReview() {
    return this.certification.runFinalReview();
  }

  @Post("certification/certify")
  certify() {
    return this.certification.certify();
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}