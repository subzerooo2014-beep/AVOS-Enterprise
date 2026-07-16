import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseKernelMegaPack2Service } from "./enterprise-kernel-mega-pack-2.service";
import { KernelDependencyGraphService } from "./dependencies/kernel-dependency-graph.service";
import { KernelDependencyResolverService } from "./dependencies/kernel-dependency-resolver.service";
import { KernelCompatibilityService } from "./compatibility/kernel-compatibility.service";
import { KernelEnvironmentProfileService } from "./profiles/kernel-environment-profile.service";
import { KernelConfigurationRegistryService } from "./configuration/kernel-configuration-registry.service";
import { KernelConfigurationVersionService } from "./versions/kernel-configuration-version.service";
import { KernelConfigurationSnapshotService } from "./configuration/kernel-configuration-snapshot.service";
import { KernelConfigurationValidationService } from "./validation/kernel-configuration-validation.service";
import { KernelDependencyConfigurationReadinessService } from "./readiness/kernel-dependency-configuration-readiness.service";
import { KernelDependencyConfigurationHealthService } from "./health/kernel-dependency-configuration-health.service";
import { KernelDependencyConfigurationAuditService } from "./observability/kernel-dependency-configuration-audit.service";
import {
  KernelCompatibilityRule,
  KernelConfigurationEntry,
  KernelDependencyNode,
  KernelEnvironmentProfile
} from "./enterprise-kernel-mega-pack-2.types";

@Controller("enterprise-kernel-v2")
export class EnterpriseKernelMegaPack2Controller {
  constructor(
    private readonly pack: EnterpriseKernelMegaPack2Service,
    private readonly graph: KernelDependencyGraphService,
    private readonly resolver: KernelDependencyResolverService,
    private readonly compatibility: KernelCompatibilityService,
    private readonly profiles: KernelEnvironmentProfileService,
    private readonly configuration: KernelConfigurationRegistryService,
    private readonly versions: KernelConfigurationVersionService,
    private readonly snapshots: KernelConfigurationSnapshotService,
    private readonly validation: KernelConfigurationValidationService,
    private readonly readiness: KernelDependencyConfigurationReadinessService,
    private readonly health: KernelDependencyConfigurationHealthService,
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("dependencies/nodes")
  dependencyNodes() {
    return {
      summary: this.graph.summary(),
      items: this.graph.listNodes()
    };
  }

  @Get("dependencies/edges")
  dependencyEdges() {
    return {
      summary: this.graph.summary(),
      items: this.graph.listEdges()
    };
  }

  @Post("dependencies/nodes")
  registerDependencyNode(
    @Body()
    body: {
      node: Omit<
        KernelDependencyNode,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.graph.registerNode(
      body.node,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("dependencies/edges")
  registerDependencyEdge(
    @Body()
    body: {
      fromNodeId: string;
      toNodeId: string;
      dependencyType:
        | "required"
        | "optional"
        | "runtime"
        | "build"
        | "policy";
      requiredVersion?: string;
      reason: string;
      active?: boolean;
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.graph.registerEdge(body);
  }

  @Post("dependencies/resolve")
  resolveDependencies(
    @Body()
    body: {
      requestedNodeIds?: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.resolver.resolve(body);
  }

  @Get("compatibility/rules")
  compatibilityRules() {
    return {
      summary: this.compatibility.summary(),
      items: this.compatibility.listRules()
    };
  }

  @Post("compatibility/rules")
  registerCompatibilityRule(
    @Body()
    body: {
      rule: Omit<
        KernelCompatibilityRule,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.compatibility.registerRule(
      body.rule,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("compatibility/assess")
  assessCompatibility(
    @Body()
    body: {
      subjectNodeId: string;
      dependencyNodeId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.compatibility.assess(body);
  }

  @Post("compatibility/assess-all")
  assessAllCompatibility(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.compatibility.assessAll(body);
  }

  @Get("profiles")
  profileList() {
    return {
      summary: this.profiles.summary(),
      items: this.profiles.list()
    };
  }

  @Get("profiles/:id")
  profile(@Param("id") id: string) {
    return this.profiles.get(id);
  }

  @Post("profiles")
  registerProfile(
    @Body()
    body: {
      profile: Omit<
        KernelEnvironmentProfile,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.profiles.register(
      body.profile,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("profiles/:id/resolve")
  resolveProfile(@Param("id") id: string) {
    return this.profiles.resolve(id);
  }

  @Get("configuration")
  configurationList() {
    return {
      summary:
        this.configuration.summary(),
      items: this.configuration.list()
    };
  }

  @Get("configuration/:id")
  configurationEntry(
    @Param("id") id: string
  ) {
    return this.configuration.get(id);
  }

  @Post("configuration")
  registerConfiguration(
    @Body()
    body: {
      entry: Omit<
        KernelConfigurationEntry,
        "version" | "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.configuration.register(
      body.entry,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("configuration/:id/value")
  updateConfigurationValue(
    @Param("id") id: string,
    @Body()
    body: {
      value: unknown;
      actorIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    return this.configuration.updateValue(
      id,
      body
    );
  }

  @Get("configuration/profile/:profileId")
  resolveConfigurationProfile(
    @Param("profileId") profileId: string
  ) {
    return this.configuration.resolveProfile(
      profileId
    );
  }

  @Get("configuration/:id/versions")
  configurationVersions(
    @Param("id") id: string
  ) {
    return {
      entryId: id,
      items: this.versions.byEntry(id)
    };
  }

  @Post("configuration/snapshots")
  createSnapshot(
    @Body()
    body: {
      profileId: string;
      createdByIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    return this.snapshots.create(body);
  }

  @Get("configuration/snapshots")
  snapshotList() {
    return {
      summary: this.snapshots.summary(),
      items: this.snapshots.list()
    };
  }

  @Post("configuration/snapshots/:id/restore")
  restoreSnapshot(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    return this.snapshots.restore({
      snapshotId: id,
      ...body
    });
  }

  @Post("validation/run")
  validateConfiguration(
    @Body()
    body: {
      profileId?: string;
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

  @Post("readiness/assess")
  assessReadiness(
    @Body()
    body: {
      profileId?: string;
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

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      profileId?: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
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
