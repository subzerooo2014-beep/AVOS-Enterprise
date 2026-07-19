import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { DocumentationIntelligenceOrchestratorService } from "./documentation-intelligence-orchestrator.service";
import { BindDocumentationBlueprintDto } from "./dto/bind-documentation-blueprint.dto";
import { SynchronizeLivingDocumentationDto } from "./dto/synchronize-living-documentation.dto";
import { AnalyzeDocumentationDto } from "./dto/analyze-documentation.dto";

@Controller("avos/documentation/intelligence")
export class DocumentationIntelligenceController {
  constructor(private readonly orchestrator: DocumentationIntelligenceOrchestratorService) {}

  @Get("status") status() { return this.orchestrator.status(); }
  @Post("verification/run") verify() { return this.orchestrator.verify(); }

  @Post("documents/:documentId/analyze")
  analyze(@Param("documentId") documentId: string, @Body() _dto: AnalyzeDocumentationDto) {
    return this.orchestrator.analyze(documentId);
  }

  @Post("analyze-all") analyzeAll() { return this.orchestrator.analyzeAll(); }

  @Get("reports")
  reports(@Query("documentId") documentId?: string) { return this.orchestrator.reports(documentId); }

  @Post("documents/:documentId/blueprint/bind")
  bind(@Param("documentId") documentId: string, @Body() dto: BindDocumentationBlueprintDto) {
    return this.orchestrator.bind(documentId, dto);
  }

  @Post("documents/:documentId/blueprint/synchronize")
  synchronize(@Param("documentId") documentId: string, @Body() dto: SynchronizeLivingDocumentationDto) {
    return this.orchestrator.synchronize(documentId, dto);
  }

  @Get("blueprint/bindings") bindings() { return this.orchestrator.bindings(); }

  @Post("documents/:documentId/snapshots")
  snapshot(@Param("documentId") documentId: string, @Body() dto: AnalyzeDocumentationDto) {
    return this.orchestrator.snapshot(documentId, dto.requestedBy);
  }

  @Get("snapshots")
  snapshots(@Query("documentId") documentId?: string) { return this.orchestrator.snapshots(documentId); }
}
