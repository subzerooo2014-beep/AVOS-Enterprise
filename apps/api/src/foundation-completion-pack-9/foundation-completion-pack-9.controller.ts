import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack9Service } from "./foundation-completion-pack-9.service";
import { DigitalIdentityRegistryService } from "./identity/digital-identity-registry.service";
import { EnterpriseMetadataRegistryService } from "./metadata/enterprise-metadata-registry.service";
import { CapabilityContractRegistryService } from "./contracts/capability-contract-registry.service";
import { EnterpriseDependencyGraphService } from "./dependencies/enterprise-dependency-graph.service";
import { DependencyImpactAnalysisService } from "./lineage/dependency-impact-analysis.service";
import { ArchitectureFoundationValidatorService } from "./validation/architecture-foundation-validator.service";
import { Foundation9AuditService } from "./observability/foundation-9-audit.service";
import {
  CapabilityContract,
  ContractStatus,
  DependencyCriticality,
  DependencyRelation,
  DigitalIdentityStatus,
  DigitalIdentityType,
  MetadataAssetType
} from "./foundation-pack-9.types";

@Controller("foundation-completion-v9")
export class FoundationCompletionPack9Controller {
  constructor(
    private readonly pack: FoundationCompletionPack9Service,
    private readonly identities: DigitalIdentityRegistryService,
    private readonly metadata: EnterpriseMetadataRegistryService,
    private readonly contracts: CapabilityContractRegistryService,
    private readonly dependencies: EnterpriseDependencyGraphService,
    private readonly impact: DependencyImpactAnalysisService,
    private readonly validator: ArchitectureFoundationValidatorService,
    private readonly audit: Foundation9AuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("identities")
  identityList() {
    return {
      summary: this.identities.summary(),
      items: this.identities.list()
    };
  }

  @Post("identities")
  registerIdentity(
    @Body()
    body: {
      id?: string;
      canonicalName: string;
      displayName: string;
      type: DigitalIdentityType;
      ownerIdentityId?: string;
      organizationIdentityId?: string;
      aliases?: string[];
      permissions?: string[];
      attributes?: Record<string, unknown>;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.identities.register(body);
  }

  @Post("identities/:id/status")
  updateIdentityStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: DigitalIdentityStatus;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.identities.updateStatus(
      id,
      body.status,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Get("metadata")
  metadataList() {
    return {
      summary: this.metadata.summary(),
      items: this.metadata.list()
    };
  }

  @Post("metadata")
  registerMetadata(
    @Body()
    body: {
      id?: string;
      assetId: string;
      assetType: MetadataAssetType;
      version: string;
      purpose: string;
      description: string;
      tags?: string[];
      ownerIdentityId: string;
      lifecycleStage: string;
      domain: string;
      sensitivity:
        | "public"
        | "internal"
        | "confidential"
        | "restricted";
      sourceSystem: string;
      schemaVersion: string;
      attributes?: Record<string, unknown>;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.metadata.register(body);
  }

  @Post("metadata/:id/update")
  updateMetadata(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        version?: string;
        purpose?: string;
        description?: string;
        tags?: string[];
        lifecycleStage?: string;
        domain?: string;
        sensitivity?:
          | "public"
          | "internal"
          | "confidential"
          | "restricted";
        schemaVersion?: string;
        attributes?: Record<string, unknown>;
      };
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.metadata.update(
      id,
      body.patch,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Get("contracts")
  contractList() {
    return {
      summary: this.contracts.summary(),
      items: this.contracts.list()
    };
  }

  @Post("contracts")
  registerContract(
    @Body()
    body: {
      contract: Omit<
        CapabilityContract,
        "createdAt" | "updatedAt"
      >;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.contracts.register(
      body.contract,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Post("contracts/:id/status")
  updateContractStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: ContractStatus;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.contracts.updateStatus(
      id,
      body.status,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Get("dependencies/nodes")
  dependencyNodes() {
    return {
      summary: this.dependencies.summary(),
      items: this.dependencies.listNodes()
    };
  }

  @Get("dependencies/edges")
  dependencyEdges() {
    return {
      summary: this.dependencies.summary(),
      items: this.dependencies.listEdges()
    };
  }

  @Post("dependencies/nodes")
  createDependencyNode(
    @Body()
    body: {
      id?: string;
      identityId: string;
      assetType: MetadataAssetType;
      label: string;
      version: string;
      metadataRecordId?: string;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.dependencies.createNode(body);
  }

  @Post("dependencies/edges")
  createDependencyEdge(
    @Body()
    body: {
      fromNodeId: string;
      toNodeId: string;
      relation: DependencyRelation;
      criticality: DependencyCriticality;
      required: boolean;
      versionConstraint?: string;
      contractId?: string;
      metadata?: Record<string, unknown>;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.dependencies.createEdge(body);
  }

  @Get("dependencies/:nodeId/neighborhood")
  dependencyNeighborhood(
    @Param("nodeId") nodeId: string
  ) {
    return this.dependencies.neighborhood(nodeId);
  }

  @Post("dependencies/:nodeId/impact")
  dependencyImpact(
    @Param("nodeId") nodeId: string,
    @Body()
    body: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.impact.calculate({
      rootNodeId: nodeId,
      correlationId: body.correlationId,
      actorIdentityId: body.actorIdentityId
    });
  }

  @Post("validation/run")
  runValidation(
    @Body()
    body: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.validator.validate(body);
  }

  @Get("validation/findings")
  validationFindings() {
    return {
      summary: this.validator.summary(),
      items: this.validator.listFindings()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
