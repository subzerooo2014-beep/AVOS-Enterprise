import { Body, Controller, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { DigitalDnaService } from "./digital-dna.service";
import { EnterpriseBrainFoundationService } from "./enterprise-brain-foundation.service";
import { IntelligenceFoundationService } from "./intelligence-foundation.service";
import { KnowledgeFabricService } from "./knowledge-fabric.service";
import { LivingBlueprintService } from "./living-blueprint.service";

@Controller("intelligence-foundation")
export class IntelligenceFoundationController {
  constructor(
    private readonly foundation: IntelligenceFoundationService,
    private readonly knowledge: KnowledgeFabricService,
    private readonly blueprints: LivingBlueprintService,
    private readonly digitalDna: DigitalDnaService,
    private readonly brain: EnterpriseBrainFoundationService,
  ) {}

  @Get("status")
  status() {
    return this.foundation.status();
  }

  @Get("verification")
  verification() {
    return this.foundation.verification();
  }

  @Post("smoke")
  smoke() {
    return this.foundation.smoke();
  }

  @Get("knowledge")
  knowledgeRecords(@Query("q") query = "") {
    return query ? this.knowledge.search(query) : this.knowledge.findAll();
  }

  @Get("knowledge/relations")
  knowledgeRelations() {
    return this.knowledge.getRelations();
  }

  @Get("blueprints")
  blueprintsList() {
    return this.blueprints.findAll();
  }

  @Post("blueprints/:id/synchronize")
  synchronizeBlueprint(@Param("id") id: string) {
    const result = this.blueprints.synchronize(id);
    if (!result) throw new NotFoundException(`Blueprint ${id} was not found.`);
    return result;
  }

  @Get("digital-dna")
  digitalDnaList() {
    return this.digitalDna.findAll();
  }

  @Get("digital-dna/:id")
  digitalDnaById(@Param("id") id: string) {
    const result = this.digitalDna.findById(id);
    if (!result) throw new NotFoundException(`Digital DNA ${id} was not found.`);
    return result;
  }

  @Post("brain/recommendations")
  createRecommendation(
    @Body()
    input: {
      title: string;
      rationale: string;
      risk?: "low" | "medium" | "high";
    },
  ) {
    return this.brain.recommend(
      input.title,
      input.rationale,
      input.risk ?? "low",
    );
  }

  @Get("brain/recommendations")
  recommendations() {
    return this.brain.findAllRecommendations();
  }

  @Post("brain/recommendations/:id/decision")
  decide(
    @Param("id") id: string,
    @Body() input: { decision: "approved" | "rejected"; approvedBy: string },
  ) {
    const result = this.brain.decide(id, input.decision, input.approvedBy);
    if (!result) throw new NotFoundException(`Recommendation ${id} was not found.`);
    return result;
  }

  @Get("brain/memory")
  memory() {
    return this.brain.getOperationalMemory();
  }
}
