import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack15Service } from "./foundation-completion-pack-15.service";
import { DigitalDnaRegistryService } from "./dna/digital-dna-registry.service";
import { DigitalDnaHistoryService } from "./history/digital-dna-history.service";
import { DigitalDnaEvolutionService } from "./evolution/digital-dna-evolution.service";
import { DigitalDnaValidatorService } from "./validation/digital-dna-validator.service";
import { DigitalDnaHealthService } from "./health/digital-dna-health.service";
import { DigitalDnaAuditService } from "./observability/digital-dna-audit.service";
import {
  DigitalDnaRecord,
  DigitalDnaStatus
} from "./foundation-pack-15.types";

@Controller("foundation-completion-v15")
export class FoundationCompletionPack15Controller {
  constructor(
    private readonly pack: FoundationCompletionPack15Service,
    private readonly registry: DigitalDnaRegistryService,
    private readonly history: DigitalDnaHistoryService,
    private readonly evolution: DigitalDnaEvolutionService,
    private readonly validator: DigitalDnaValidatorService,
    private readonly health: DigitalDnaHealthService,
    private readonly audit: DigitalDnaAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("dna")
  dnaList() {
    return {
      summary: this.registry.summary(),
      items: this.registry.list()
    };
  }

  @Get("dna/:id")
  dna(@Param("id") id: string) {
    return this.registry.get(id);
  }

  @Post("dna")
  registerDna(
    @Body()
    body: {
      id?: string;
      identity: DigitalDnaRecord["identity"];
      purpose: DigitalDnaRecord["purpose"];
      contracts?: DigitalDnaRecord["contracts"];
      dependencies?: DigitalDnaRecord["dependencies"];
      policies?: DigitalDnaRecord["policies"];
      permissions?: DigitalDnaRecord["permissions"];
      events?: string[];
      metrics?: DigitalDnaRecord["metrics"];
      version: string;
      status?: DigitalDnaStatus;
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.register(body);
  }

  @Post("dna/:id/update")
  updateDna(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        purpose?: DigitalDnaRecord["purpose"];
        contracts?: DigitalDnaRecord["contracts"];
        dependencies?: DigitalDnaRecord["dependencies"];
        policies?: DigitalDnaRecord["policies"];
        permissions?: DigitalDnaRecord["permissions"];
        events?: string[];
        metrics?: DigitalDnaRecord["metrics"];
        version?: string;
        status?: DigitalDnaStatus;
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

  @Get("dna/:id/history")
  dnaHistory(@Param("id") id: string) {
    return {
      dnaId: id,
      items: this.history.byDna(id)
    };
  }

  @Post("dna/:id/history")
  snapshotHistory(
    @Param("id") id: string,
    @Body()
    body: {
      action: string;
      actorIdentityId: string;
      reason: string;
      previousVersion?: string;
      nextVersion?: string;
      correlationId: string;
    }
  ) {
    return this.history.snapshot({
      dnaId: id,
      ...body
    });
  }

  @Post("dna/:id/evolve")
  evolveDna(
    @Param("id") id: string,
    @Body()
    body: {
      toVersion: string;
      changeSummary: string;
      changedSections: string[];
      compatibility:
        | "compatible"
        | "conditionally-compatible"
        | "breaking";
      approvedByIdentityId?: string;
      evolvedByIdentityId: string;
      correlationId: string;
      patch: {
        purpose?: DigitalDnaRecord["purpose"];
        contracts?: DigitalDnaRecord["contracts"];
        dependencies?: DigitalDnaRecord["dependencies"];
        policies?: DigitalDnaRecord["policies"];
        permissions?: DigitalDnaRecord["permissions"];
        events?: string[];
        metrics?: DigitalDnaRecord["metrics"];
        metadata?: Record<string, unknown>;
      };
    }
  ) {
    return this.evolution.evolve({
      dnaId: id,
      ...body
    });
  }

  @Post("validation/run")
  validateDna(
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
