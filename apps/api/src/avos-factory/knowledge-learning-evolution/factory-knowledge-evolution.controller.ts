import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FactoryKnowledgeEvolutionCoordinatorService } from "./factory-knowledge-evolution-coordinator.service";

@Controller("avos-factory/knowledge-evolution")
export class FactoryKnowledgeEvolutionController {
  constructor(
    private readonly coordinator:
      FactoryKnowledgeEvolutionCoordinatorService,
  ) {}

  @Get("status")
  status() {
    return this.coordinator.status();
  }

  @Get("verification")
  verification() {
    return this.coordinator.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.coordinator.bootstrap();
  }

  @Post("knowledge")
  captureKnowledge(
    @Body()
    input: Parameters<
      FactoryKnowledgeEvolutionCoordinatorService["captureKnowledge"]
    >[0],
  ) {
    return this.coordinator.captureKnowledge(input);
  }

  @Post("memory")
  remember(
    @Body()
    input: Parameters<
      FactoryKnowledgeEvolutionCoordinatorService["remember"]
    >[0],
  ) {
    return this.coordinator.remember(input);
  }

  @Post("learning-signals")
  learn(
    @Body()
    input: Parameters<
      FactoryKnowledgeEvolutionCoordinatorService["learn"]
    >[0],
  ) {
    return this.coordinator.learn(input);
  }

  @Get("replay/:workItemId")
  replay(@Param("workItemId") workItemId: string) {
    return this.coordinator.replay(workItemId);
  }

  @Get("patterns")
  patterns() {
    return this.coordinator.patterns();
  }

  @Post("evolution")
  proposeEvolution(
    @Body()
    input: Parameters<
      FactoryKnowledgeEvolutionCoordinatorService["proposeEvolution"]
    >[0],
  ) {
    return this.coordinator.proposeEvolution(input);
  }

  @Post("evolution/:id/approve")
  approveEvolution(
    @Param("id") id: string,
    @Body("approvedBy") approvedBy: string,
  ) {
    return this.coordinator.approveEvolution(id, approvedBy);
  }

  @Get("optimization/:targetId")
  optimize(@Param("targetId") targetId: string) {
    return this.coordinator.optimize(targetId);
  }

  @Get("prediction/:targetId")
  predict(@Param("targetId") targetId: string) {
    return this.coordinator.predict(targetId);
  }

  @Get("root-cause/:workItemId")
  rootCause(@Param("workItemId") workItemId: string) {
    return this.coordinator.analyzeRootCause(workItemId);
  }

  @Post("recovery/:workItemId")
  createRecovery(@Param("workItemId") workItemId: string) {
    return this.coordinator.createRecovery(workItemId);
  }

  @Post("recovery/plans/:id/approve")
  approveRecovery(
    @Param("id") id: string,
    @Body("approvedBy") approvedBy: string,
  ) {
    return this.coordinator.approveRecovery(id, approvedBy);
  }

  @Post("recovery/plans/:id/execute")
  executeRecovery(@Param("id") id: string) {
    return this.coordinator.executeRecovery(id);
  }

  @Post("dna")
  registerDna(
    @Body()
    input: Parameters<
      FactoryKnowledgeEvolutionCoordinatorService["registerDna"]
    >[0],
  ) {
    return this.coordinator.registerDna(input);
  }

  @Get("graph")
  graph() {
    return this.coordinator.graphSnapshot();
  }

  @Get("executive-intelligence")
  intelligence() {
    return this.coordinator.intelligence();
  }

  @Post("certify")
  certify(@Body("approvedBy") approvedBy: string) {
    return this.coordinator.certify(approvedBy);
  }
}
