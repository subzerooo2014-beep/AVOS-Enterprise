import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack19Service } from "./foundation-completion-pack-19.service";
import { EnterpriseOntologyRegistryService } from "./ontology/enterprise-ontology-registry.service";
import { OntologyTermRegistryService } from "./terms/ontology-term-registry.service";
import { OntologyRelationRegistryService } from "./relations/ontology-relation-registry.service";
import { OntologyConstraintRegistryService } from "./constraints/ontology-constraint-registry.service";
import { OntologyMappingService } from "./mapping/ontology-mapping.service";
import { OntologyValidatorService } from "./validation/ontology-validator.service";
import { OntologyVersionService } from "./versions/ontology-version.service";
import { OntologyHealthService } from "./health/ontology-health.service";
import { OntologyAuditService } from "./observability/ontology-audit.service";
import {
  OntologyConstraint,
  OntologyDefinition,
  OntologyRelation,
  OntologyRelationType,
  OntologyTermStatus,
  OntologyTermType
} from "./foundation-pack-19.types";

@Controller("foundation-completion-v19")
export class FoundationCompletionPack19Controller {
  constructor(
    private readonly pack: FoundationCompletionPack19Service,
    private readonly ontologies: EnterpriseOntologyRegistryService,
    private readonly terms: OntologyTermRegistryService,
    private readonly relations: OntologyRelationRegistryService,
    private readonly constraints: OntologyConstraintRegistryService,
    private readonly mappings: OntologyMappingService,
    private readonly validator: OntologyValidatorService,
    private readonly versions: OntologyVersionService,
    private readonly health: OntologyHealthService,
    private readonly audit: OntologyAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("ontologies")
  ontologyList() {
    return {
      summary: this.ontologies.summary(),
      items: this.ontologies.list()
    };
  }

  @Get("ontologies/:id")
  ontology(@Param("id") id: string) {
    return this.ontologies.get(id);
  }

  @Post("ontologies")
  registerOntology(
    @Body()
    body: {
      ontology: Omit<
        OntologyDefinition,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.ontologies.register(
      body.ontology,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("ontologies/:id/update")
  updateOntology(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        description?: string;
        version?: string;
        status?: OntologyTermStatus;
        ownerIdentityId?: string;
        domains?: string[];
        metadata?: Record<string, unknown>;
      };
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.ontologies.update(
      id,
      body.patch,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("terms")
  termList() {
    return {
      summary: this.terms.summary(),
      items: this.terms.list()
    };
  }

  @Post("terms")
  registerTerm(
    @Body()
    body: {
      id?: string;
      ontologyId: string;
      canonicalName: string;
      displayName: string;
      definition: string;
      termType: OntologyTermType;
      status?: OntologyTermStatus;
      aliases?: string[];
      attributes?: Record<string, unknown>;
      parentTermIds?: string[];
      externalReferences?: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.terms.register(body);
  }

  @Post("terms/:id/update")
  updateTerm(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        displayName?: string;
        definition?: string;
        status?: OntologyTermStatus;
        aliases?: string[];
        attributes?: Record<string, unknown>;
        parentTermIds?: string[];
        externalReferences?: string[];
      };
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.terms.update(
      id,
      body.patch,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("relations")
  registerRelation(
    @Body()
    body: {
      ontologyId: string;
      fromTermId: string;
      toTermId: string;
      relation: OntologyRelationType;
      label: string;
      cardinality: OntologyRelation["cardinality"];
      transitive?: boolean;
      symmetric?: boolean;
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.relations.register(body);
  }

  @Get("terms/:id/relations")
  termRelations(@Param("id") id: string) {
    return {
      termId: id,
      items: this.relations.byTerm(id)
    };
  }

  @Post("constraints")
  registerConstraint(
    @Body()
    body: {
      id?: string;
      ontologyId: string;
      termId: string;
      field: string;
      operator: OntologyConstraint["operator"];
      value?: unknown;
      message: string;
      severity: OntologyConstraint["severity"];
      active?: boolean;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.constraints.register(body);
  }

  @Post("constraints/:id/evaluate")
  evaluateConstraint(
    @Param("id") id: string,
    @Body()
    body: {
      payload: Record<string, unknown>;
    }
  ) {
    return this.constraints.evaluate(
      id,
      body.payload
    );
  }

  @Post("mappings")
  registerMapping(
    @Body()
    body: {
      ontologyId: string;
      termId: string;
      sourceSystem: string;
      sourceType: string;
      sourceValue: string;
      targetValue: string;
      confidence?: number;
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.mappings.register(body);
  }

  @Get("mappings/resolve/:sourceSystem/:sourceValue")
  resolveMapping(
    @Param("sourceSystem") sourceSystem: string,
    @Param("sourceValue") sourceValue: string
  ) {
    return this.mappings.resolve(
      sourceSystem,
      sourceValue
    );
  }

  @Post("validation/run")
  validateOntology(
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

  @Post("versions")
  createVersion(
    @Body()
    body: {
      ontologyId: string;
      version: string;
      changeSummary: string;
      createdByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.versions.create(body);
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      ontologyId: string;
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
