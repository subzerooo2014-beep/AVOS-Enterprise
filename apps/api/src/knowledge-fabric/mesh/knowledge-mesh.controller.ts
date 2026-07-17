import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { KnowledgeMeshHealthService } from "./knowledge-mesh-health.service";
import { KnowledgeMeshPolicyService } from "./knowledge-mesh-policy.service";
import { KnowledgeMeshRegistryService } from "./knowledge-mesh-registry.service";
import { KnowledgeMeshRoutingService } from "./knowledge-mesh-routing.service";
import { KnowledgeMeshRuntimeService } from "./knowledge-mesh-runtime.service";
import { KnowledgeMeshDomain, KnowledgeMeshNode } from "./knowledge-mesh.types";

@Controller("knowledge-fabric/mesh")
export class KnowledgeMeshController {
  constructor(
    private readonly registry: KnowledgeMeshRegistryService,
    private readonly routing: KnowledgeMeshRoutingService,
    private readonly policies: KnowledgeMeshPolicyService,
    private readonly runtime: KnowledgeMeshRuntimeService,
    private readonly health: KnowledgeMeshHealthService,
  ) {}

  @Get("status") status() { return this.health.status(); }
  @Get("domains") domains() { return this.registry.listDomains(); }
  @Get("nodes") nodes() { return this.registry.listNodes(); }
  @Get("routes") routes() { return this.routing.list(); }
  @Get("policies") policiesList() { return this.policies.list(); }

  @Post("domains") registerDomain(@Body() body: Parameters<KnowledgeMeshRegistryService["registerDomain"]>[0]) {
    return this.registry.registerDomain(body);
  }

  @Post("nodes") registerNode(@Body() body: Parameters<KnowledgeMeshRegistryService["registerNode"]>[0]) {
    return this.registry.registerNode(body);
  }

  @Patch("nodes/:id/state") updateNodeState(@Param("id") id: string, @Body("state") state: KnowledgeMeshNode["state"]) {
    return this.registry.updateNodeState(id, state);
  }

  @Patch("domains/:id/state") updateDomainState(@Param("id") id: string, @Body("state") state: KnowledgeMeshDomain["state"]) {
    return this.registry.updateDomainState(id, state);
  }

  @Post("routes") addRoute(@Body() body: Parameters<KnowledgeMeshRoutingService["addRoute"]>[0]) {
    return this.routing.addRoute(body);
  }

  @Post("policies") addPolicy(@Body() body: Parameters<KnowledgeMeshPolicyService["addPolicy"]>[0]) {
    return this.policies.addPolicy(body);
  }

  @Post("execute") execute(@Body() body: Parameters<KnowledgeMeshRuntimeService["execute"]>[0]) {
    return this.runtime.execute(body);
  }
}