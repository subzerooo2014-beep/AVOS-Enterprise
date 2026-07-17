import { Injectable } from "@nestjs/common";
import { KnowledgeFederationRegistryService } from "./knowledge-federation-registry.service";
import { KnowledgeFederationRouteService } from "./knowledge-federation-route.service";
import { KnowledgeFederatedQueryService } from "./knowledge-federated-query.service";
import { KnowledgeFederationEventService } from "./knowledge-federation-event.service";
@Injectable()
export class KnowledgeFederationHealthService { constructor(private readonly registry:KnowledgeFederationRegistryService,private readonly routes:KnowledgeFederationRouteService,private readonly queries:KnowledgeFederatedQueryService,private readonly events:KnowledgeFederationEventService){} status(){return {success:true,system:"AVOS Knowledge Fabric",pack:"KF-7 Knowledge Federation",status:"operational",capabilities:{federationRegistry:true,routing:true,trust:true,policy:true,federatedQuery:true,adapters:true,quorum:true,events:true},metrics:{nodes:this.registry.count(),routes:this.routes.count(),...this.queries.metrics(),events:this.events.count()},checkedAt:new Date().toISOString(),nextMegaPack:"KF-8 Knowledge Mesh"};} }