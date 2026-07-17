import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { KnowledgeFederationRegistryService } from "./knowledge-federation-registry.service";
import { KnowledgeFederationRouteService } from "./knowledge-federation-route.service";
import { KnowledgeFederatedQueryService } from "./knowledge-federated-query.service";
import { KnowledgeFederationHealthService } from "./knowledge-federation-health.service";
import { FederationNode, FederationQuery, FederationRoute } from "./knowledge-federation.types";
@Controller("knowledge-fabric/federation")
export class KnowledgeFederationController {
  constructor(private readonly registry:KnowledgeFederationRegistryService,private readonly routes:KnowledgeFederationRouteService,private readonly queries:KnowledgeFederatedQueryService,private readonly health:KnowledgeFederationHealthService){}
  @Get("status") status(){return this.health.status();}
  @Get("nodes") nodes(){return this.registry.list();}
  @Get("nodes/:id") node(@Param("id")id:string){return this.registry.get(id);}
  @Post("nodes") register(@Body()body:Omit<FederationNode,"id"|"state"|"registeredAt"|"updatedAt">){return this.registry.register(body);}
  @Patch("nodes/:id/state") state(@Param("id")id:string,@Body()body:{state:FederationNode["state"]}){return this.registry.updateState(id,body.state);}
  @Get("routes") routeList(){return this.routes.list();}
  @Post("routes") addRoute(@Body()body:Omit<FederationRoute,"id"|"createdAt">){return this.routes.add(body);}
  @Post("query") query(@Body()body:Omit<FederationQuery,"id"|"requestedAt">){return this.queries.execute(body);}
}