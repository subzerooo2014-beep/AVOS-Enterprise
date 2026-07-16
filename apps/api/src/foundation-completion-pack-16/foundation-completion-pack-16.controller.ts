import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack16Service } from "./foundation-completion-pack-16.service";
import { EnterpriseDigitalGenomeRegistryService } from "./genome/enterprise-digital-genome-registry.service";
import { GenomeCompositionEngineService } from "./composition/genome-composition-engine.service";
import { GenomeSnapshotService } from "./snapshots/genome-snapshot.service";
import { GenomeComparisonService } from "./comparison/genome-comparison.service";
import { GenomeEvolutionService } from "./evolution/genome-evolution.service";
import { GenomeValidatorService } from "./validation/genome-validator.service";
import { GenomeHealthService } from "./health/genome-health.service";
import { GenomeAuditService } from "./observability/genome-audit.service";
import {
  EnterpriseDigitalGenome,
  GenomeLayer,
  GenomeLayerComposition,
  GenomeStatus
} from "./foundation-pack-16.types";

@Controller("foundation-completion-v16")
export class FoundationCompletionPack16Controller {
  constructor(
    private readonly pack: FoundationCompletionPack16Service,
    private readonly registry: EnterpriseDigitalGenomeRegistryService,
    private readonly composition: GenomeCompositionEngineService,
    private readonly snapshots: GenomeSnapshotService,
    private readonly comparison: GenomeComparisonService,
    private readonly evolution: GenomeEvolutionService,
    private readonly validator: GenomeValidatorService,
    private readonly health: GenomeHealthService,
    private readonly audit: GenomeAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("genomes")
  genomeList() {
    return {
      summary: this.registry.summary(),
      items: this.registry.list()
    };
  }

  @Get("genomes/:id")
  genome(@Param("id") id: string) {
    return this.registry.get(id);
  }

  @Post("genomes")
  registerGenome(
    @Body()
    body: {
      id?: string;
      name: string;
      description: string;
      version: string;
      status?: GenomeStatus;
      organizationIdentityId: string;
      layers?: GenomeLayerComposition[];
      crossLayerRelations?: EnterpriseDigitalGenome["crossLayerRelations"];
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.register(body);
  }

  @Post("genomes/:id/update")
  updateGenome(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        description?: string;
        version?: string;
        status?: GenomeStatus;
        layers?: GenomeLayerComposition[];
        crossLayerRelations?: EnterpriseDigitalGenome["crossLayerRelations"];
        metadata?: Record<string, unknown>;
      };
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.update(
      id,
      body.patch,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("genomes/:id/compose")
  composeGenome(
    @Param("id") id: string,
    @Body()
    body: {
      references: Array<
        GenomeLayerComposition["dnaReferences"][number]
      >;
      layerMapping: Record<string, GenomeLayer>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.composition.compose({
      genomeId: id,
      ...body
    });
  }

  @Get("genomes/:id/balance")
  genomeBalance(@Param("id") id: string) {
    return this.composition.calculateBalance(id);
  }

  @Get("genomes/:id/snapshots")
  genomeSnapshots(@Param("id") id: string) {
    return {
      genomeId: id,
      items: this.snapshots.byGenome(id)
    };
  }

  @Post("genomes/:id/snapshots")
  snapshotGenome(
    @Param("id") id: string,
    @Body()
    body: {
      createdByIdentityId: string;
      reason: string;
      correlationId: string;
    }
  ) {
    return this.snapshots.create({
      genomeId: id,
      ...body
    });
  }

  @Post("genomes/:id/compare")
  compareGenome(
    @Param("id") id: string,
    @Body()
    body: {
      fromVersion: string;
      toVersion: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.comparison.compare({
      genomeId: id,
      ...body
    });
  }

  @Post("genomes/:id/evolve")
  evolveGenome(
    @Param("id") id: string,
    @Body()
    body: {
      toVersion: string;
      changeSummary: string;
      affectedLayers: GenomeLayer[];
      compatibility:
        | "compatible"
        | "conditionally-compatible"
        | "breaking";
      approvedByIdentityId?: string;
      evolvedByIdentityId: string;
      correlationId: string;
      patch: {
        description?: string;
        status?: GenomeStatus;
        layers?: GenomeLayerComposition[];
        crossLayerRelations?: EnterpriseDigitalGenome["crossLayerRelations"];
        metadata?: Record<string, unknown>;
      };
    }
  ) {
    return this.evolution.evolve({
      genomeId: id,
      ...body
    });
  }

  @Post("validation/run")
  validateGenome(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.validator.validate(body);
  }

  @Get("validation/findings")
  validationFindings() {
    return {
      summary: this.validator.summary(),
      items: this.validator.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      genomeId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
