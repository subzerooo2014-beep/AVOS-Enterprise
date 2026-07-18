import {
  Body,
  Controller,
  Get,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryBlueprintSyncService
} from "./avos-factory-blueprint-sync.service";
import {
  AvosFactoryCapabilityPublisherService
} from "./avos-factory-capability-publisher.service";
import {
  AvosFactoryDNAEvolutionService
} from "./avos-factory-dna-evolution.service";
import {
  AvosFactoryEventBusService
} from "./avos-factory-event-bus.service";
import {
  AvosFactoryKnowledgePublisherService
} from "./avos-factory-knowledge-publisher.service";
import {
  AvosFactorySynchronizationOrchestratorService
} from "./avos-factory-synchronization-orchestrator.service";
import {
  AvosFactorySynchronizationSmokeService
} from "./avos-factory-synchronization-smoke.service";

@Controller("avos/factory/v1/synchronization")
export class AvosFactorySynchronizationController {
  constructor(
    private readonly capabilities:
      AvosFactoryCapabilityPublisherService,
    private readonly knowledge:
      AvosFactoryKnowledgePublisherService,
    private readonly blueprint:
      AvosFactoryBlueprintSyncService,
    private readonly dna:
      AvosFactoryDNAEvolutionService,
    private readonly orchestrator:
      AvosFactorySynchronizationOrchestratorService,
    private readonly smoke:
      AvosFactorySynchronizationSmokeService,
    private readonly events:
      AvosFactoryEventBusService
  ) {}

  @Post("capability-fabric/publish")
  publishCapability(
    @Body() input: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.capabilities.publish(input);
  }

  @Post("knowledge-fabric/publish")
  publishKnowledge(
    @Body() input: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.knowledge.publish(input);
  }

  @Post("living-blueprint/sync")
  synchronizeBlueprint(
    @Body() input: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.blueprint.synchronize(input);
  }

  @Post("digital-dna/evolve")
  evolveDNA(
    @Body() input: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.dna.evolve(input);
  }

  @Post("all/run")
  synchronizeAll(
    @Body() input: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.orchestrator.synchronizeAll(
      input
    );
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }

  @Get("records")
  records(
    @Query("limit") limit?: string
  ) {
    const parsed =
      Number(limit);

    return {
      items:
        this.orchestrator.list(
          Number.isFinite(parsed)
            ? Math.trunc(parsed)
            : 100
        )
    };
  }

  @Get("events")
  eventList(
    @Query("limit") limit?: string
  ) {
    const parsed =
      Number(limit);

    return {
      count:
        this.events.count(),
      items:
        this.events.list(
          Number.isFinite(parsed)
            ? Math.trunc(parsed)
            : 100
        )
    };
  }
}
