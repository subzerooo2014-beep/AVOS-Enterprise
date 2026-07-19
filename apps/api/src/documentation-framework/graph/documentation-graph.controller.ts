import { Body, Controller, Get, Post } from "@nestjs/common";
import { DocumentationGraphService } from "./documentation-graph.service";
import { DocumentationGraphVerificationService } from "./documentation-graph-verification.service";

interface GenerateSemanticLinksBody {
  minimumSimilarity?: number;
}

interface SynchronizeKnowledgeBody {
  synchronizedBy?: string;
}

@Controller("avos/documentation/graph")
export class DocumentationGraphController {
  constructor(
    private readonly graph: DocumentationGraphService,
    private readonly verification: DocumentationGraphVerificationService,
  ) {}

  @Get("status")
  status() {
    return this.graph.status();
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Post("rebuild")
  rebuild() {
    return this.graph.rebuild();
  }

  @Post("semantic-links/generate")
  generateSemanticLinks(@Body() body: GenerateSemanticLinksBody = {}) {
    return this.graph.generateSemanticLinks(body.minimumSimilarity ?? 0.1);
  }

  @Post("knowledge/synchronize")
  synchronizeKnowledge(@Body() body: SynchronizeKnowledgeBody = {}) {
    return this.graph.synchronizeKnowledge(
      body.synchronizedBy ?? "human:unknown",
    );
  }
}