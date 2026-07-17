import { Module } from "@nestjs/common";
import { KnowledgeFederationRegistryService } from "./knowledge-federation-registry.service";
import { KnowledgeFederationRouteService } from "./knowledge-federation-route.service";
import { KnowledgeFederationTrustService } from "./knowledge-federation-trust.service";
import { KnowledgeFederationPolicyService } from "./knowledge-federation-policy.service";
import { KnowledgeFederationAdapterService } from "./knowledge-federation-adapter.service";
import { KnowledgeFederationQuorumService } from "./knowledge-federation-quorum.service";
import { KnowledgeFederationEventService } from "./knowledge-federation-event.service";
import { KnowledgeFederatedQueryService } from "./knowledge-federated-query.service";
import { KnowledgeFederationHealthService } from "./knowledge-federation-health.service";
import { KnowledgeFederationController } from "./knowledge-federation.controller";
@Module({controllers:[KnowledgeFederationController],providers:[KnowledgeFederationRegistryService,KnowledgeFederationRouteService,KnowledgeFederationTrustService,KnowledgeFederationPolicyService,KnowledgeFederationAdapterService,KnowledgeFederationQuorumService,KnowledgeFederationEventService,KnowledgeFederatedQueryService,KnowledgeFederationHealthService],exports:[KnowledgeFederationRegistryService,KnowledgeFederationRouteService,KnowledgeFederationTrustService,KnowledgeFederationPolicyService,KnowledgeFederationAdapterService,KnowledgeFederationQuorumService,KnowledgeFederationEventService,KnowledgeFederatedQueryService,KnowledgeFederationHealthService]})
export class KnowledgeFederationModule {}