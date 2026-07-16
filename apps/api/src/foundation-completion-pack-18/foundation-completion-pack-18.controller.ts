import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack18Service } from "./foundation-completion-pack-18.service";
import { FoundationComponentRegistryService } from "./registry/foundation-component-registry.service";
import { FoundationSelfValidationService } from "./validation/foundation-self-validation.service";
import { FoundationConsistencyService } from "./consistency/foundation-consistency.service";
import { FoundationMaturityService } from "./maturity/foundation-maturity.service";
import { FoundationReadinessService } from "./readiness/foundation-readiness.service";
import { FoundationRecommendationService } from "./recommendations/foundation-recommendation.service";
import { FoundationHealthService } from "./health/foundation-health.service";
import { FoundationValidationAuditService } from "./observability/foundation-validation-audit.service";
import {
  FoundationComponentDefinition,
  FoundationComponentStatus,
  FoundationRecommendation
} from "./foundation-pack-18.types";

@Controller("foundation-completion-v18")
export class FoundationCompletionPack18Controller {
  constructor(
    private readonly pack: FoundationCompletionPack18Service,
    private readonly registry: FoundationComponentRegistryService,
    private readonly validation: FoundationSelfValidationService,
    private readonly consistency: FoundationConsistencyService,
    private readonly maturity: FoundationMaturityService,
    private readonly readiness: FoundationReadinessService,
    private readonly recommendations: FoundationRecommendationService,
    private readonly health: FoundationHealthService,
    private readonly audit: FoundationValidationAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("components")
  componentList() {
    return {
      summary: this.registry.summary(),
      items: this.registry.list()
    };
  }

  @Get("components/:id")
  component(@Param("id") id: string) {
    return this.registry.get(id);
  }

  @Post("components")
  registerComponent(
    @Body()
    body: {
      component: Omit<
        FoundationComponentDefinition,
        "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.register(
      body.component,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("components/:id/status")
  updateComponentStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: FoundationComponentStatus;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.updateStatus(
      id,
      body.status,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("validation/run")
  runValidation(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.validation.validate(body);
  }

  @Get("validation/findings")
  validationFindings() {
    return {
      summary: this.validation.summary(),
      items: this.validation.list()
    };
  }

  @Post("consistency/check")
  checkConsistency(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.consistency.check(body);
  }

  @Post("maturity/assess")
  assessMaturity(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.maturity.assess(body);
  }

  @Post("readiness/assess")
  assessReadiness(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.readiness.assess(body);
  }

  @Get("readiness")
  readinessList() {
    return {
      summary: this.readiness.summary(),
      items: this.readiness.list()
    };
  }

  @Post("recommendations/generate")
  generateRecommendations(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recommendations.generate(body);
  }

  @Get("recommendations")
  recommendationList() {
    return {
      summary: this.recommendations.summary(),
      items: this.recommendations.list()
    };
  }

  @Post("recommendations/:id/status")
  updateRecommendationStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: FoundationRecommendation["status"];
    }
  ) {
    return this.recommendations.updateStatus(
      id,
      body.status
    );
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
