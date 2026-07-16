import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseKernelMegaPack6Service } from "./enterprise-kernel-mega-pack-6.service";
import { KernelPluginRegistryService } from "./plugins/kernel-plugin-registry.service";
import { KernelPluginPermissionService } from "./plugins/kernel-plugin-permission.service";
import { KernelPluginCompatibilityService } from "./compatibility/kernel-plugin-compatibility.service";
import { KernelPluginSandboxService } from "./sandbox/kernel-plugin-sandbox.service";
import { KernelPluginLifecycleService } from "./lifecycle/kernel-plugin-lifecycle.service";
import { KernelExtensionPointRegistryService } from "./extensions/kernel-extension-point-registry.service";
import { KernelServiceRegistryService } from "./services/kernel-service-registry.service";
import { KernelCapabilityDiscoveryService } from "./capabilities/kernel-capability-discovery.service";
import { KernelSdkService } from "./sdk/kernel-sdk.service";
import { KernelPluginHealthService } from "./health/kernel-plugin-health.service";
import { KernelPluginAuditService } from "./observability/kernel-plugin-audit.service";
import {
  KernelCapabilityDescriptor,
  KernelExtensionBinding,
  KernelExtensionPoint,
  KernelPluginManifest,
  KernelSandboxPolicy,
  KernelServiceDescriptor
} from "./enterprise-kernel-mega-pack-6.types";

@Controller("enterprise-kernel-v6")
export class EnterpriseKernelMegaPack6Controller {
  constructor(
    private readonly pack: EnterpriseKernelMegaPack6Service,
    private readonly plugins: KernelPluginRegistryService,
    private readonly permissions: KernelPluginPermissionService,
    private readonly compatibility: KernelPluginCompatibilityService,
    private readonly sandbox: KernelPluginSandboxService,
    private readonly lifecycle: KernelPluginLifecycleService,
    private readonly extensions: KernelExtensionPointRegistryService,
    private readonly services: KernelServiceRegistryService,
    private readonly capabilities: KernelCapabilityDiscoveryService,
    private readonly sdk: KernelSdkService,
    private readonly health: KernelPluginHealthService,
    private readonly audit: KernelPluginAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("plugins")
  pluginList() {
    return {
      summary: this.plugins.summary(),
      items: this.plugins.list()
    };
  }

  @Post("plugins")
  registerPlugin(
    @Body()
    body: {
      manifest: KernelPluginManifest;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.plugins.register(
      body.manifest,
      {
        actorIdentityId:
          body.actorIdentityId,
        correlationId:
          body.correlationId
      }
    );
  }

  @Post("plugins/:id/validate")
  validatePlugin(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.lifecycle.validate({
      pluginId: id,
      ...body
    });
  }

  @Post("plugins/:id/install")
  installPlugin(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.lifecycle.install({
      pluginId: id,
      ...body
    });
  }

  @Post("plugins/:id/enable")
  enablePlugin(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.lifecycle.enable({
      pluginId: id,
      ...body
    });
  }

  @Post("plugins/:id/disable")
  disablePlugin(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    return this.lifecycle.disable({
      pluginId: id,
      ...body
    });
  }

  @Post("plugins/:id/upgrade")
  upgradePlugin(
    @Param("id") id: string,
    @Body()
    body: {
      newVersion: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.lifecycle.upgrade({
      pluginId: id,
      ...body
    });
  }

  @Post("plugins/:id/rollback")
  rollbackPlugin(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.lifecycle.rollback({
      pluginId: id,
      ...body
    });
  }

  @Post("plugins/:id/remove")
  removePlugin(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    return this.lifecycle.remove({
      pluginId: id,
      ...body
    });
  }

  @Get("plugins/lifecycle/events")
  lifecycleEvents() {
    return {
      summary:
        this.lifecycle.summary(),
      items:
        this.lifecycle.listEvents()
    };
  }

  @Post("plugins/:id/permissions/grant")
  grantPermission(
    @Param("id") id: string,
    @Body()
    body: {
      permission: string;
      grantedByIdentityId: string;
      reason: string;
      correlationId: string;
    }
  ) {
    return this.permissions.grant({
      pluginId: id,
      ...body
    });
  }

  @Post("permissions/:grantId/revoke")
  revokePermission(
    @Param("grantId") grantId: string,
    @Body()
    body: {
      revokedByIdentityId: string;
      reason: string;
      correlationId: string;
    }
  ) {
    return this.permissions.revoke({
      grantId,
      ...body
    });
  }

  @Get("permissions")
  permissionList() {
    return {
      summary:
        this.permissions.summary(),
      items:
        this.permissions.list()
    };
  }

  @Post("sandbox/configure")
  configureSandbox(
    @Body()
    body: {
      policy: Omit<
        KernelSandboxPolicy,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.sandbox.configure(
      body.policy,
      {
        actorIdentityId:
          body.actorIdentityId,
        correlationId:
          body.correlationId
      }
    );
  }

  @Post("sandbox/execute")
  executeSandbox(
    @Body()
    body: {
      pluginId: string;
      operation: string;
      payload: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.sandbox.execute(body);
  }

  @Get("sandbox/policies")
  sandboxPolicies() {
    return {
      summary:
        this.sandbox.summary(),
      items:
        this.sandbox.list()
    };
  }

  @Get("extensions/points")
  extensionPoints() {
    return {
      summary:
        this.extensions.summary(),
      items:
        this.extensions.listPoints()
    };
  }

  @Post("extensions/points")
  registerExtensionPoint(
    @Body()
    body: {
      extensionPoint: Omit<
        KernelExtensionPoint,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.extensions.registerPoint(
      body.extensionPoint,
      {
        actorIdentityId:
          body.actorIdentityId,
        correlationId:
          body.correlationId
      }
    );
  }

  @Post("extensions/bindings")
  bindExtension(
    @Body()
    body: {
      binding: Omit<
        KernelExtensionBinding,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.extensions.bind(
      this.plugins,
      body.binding,
      {
        actorIdentityId:
          body.actorIdentityId,
        correlationId:
          body.correlationId
      }
    );
  }

  @Get("extensions/bindings")
  extensionBindings() {
    return {
      summary:
        this.extensions.summary(),
      items:
        this.extensions.listBindings()
    };
  }

  @Get("services")
  serviceList() {
    return {
      summary:
        this.services.summary(),
      items:
        this.services.list()
    };
  }

  @Post("services")
  registerService(
    @Body()
    body: {
      service: Omit<
        KernelServiceDescriptor,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.services.register(
      body.service,
      {
        actorIdentityId:
          body.actorIdentityId,
        correlationId:
          body.correlationId
      }
    );
  }

  @Post("services/:id/invoke")
  invokeService(
    @Param("id") id: string,
    @Body()
    body: {
      methodName: string;
      payload: Record<string, unknown>;
      grantedPermissions: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.services.invoke({
      serviceId: id,
      ...body
    });
  }

  @Get("capabilities")
  capabilityList() {
    return {
      summary:
        this.capabilities.summary(),
      items:
        this.capabilities.list()
    };
  }

  @Post("capabilities")
  registerCapability(
    @Body()
    body: {
      capability: Omit<
        KernelCapabilityDescriptor,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.capabilities.register(
      body.capability,
      {
        actorIdentityId:
          body.actorIdentityId,
        correlationId:
          body.correlationId
      }
    );
  }

  @Get("sdk/operations")
  sdkOperations() {
    return {
      summary: this.sdk.summary(),
      items: this.sdk.list()
    };
  }

  @Post("sdk/refresh")
  refreshSdk() {
    return this.sdk.refresh();
  }

  @Post("sdk/invoke")
  invokeSdk(
    @Body()
    body: {
      operationId: string;
      payload: Record<string, unknown>;
      grantedPermissions: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.sdk.invoke(body);
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

  @Get("health")
  healthList() {
    return {
      summary:
        this.health.summary(),
      items:
        this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary:
        this.audit.summary(),
      items:
        this.audit.list()
    };
  }
}
