import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { KnowledgeExchangeHealthService } from "./knowledge-exchange-health.service";
import { KnowledgeExchangePolicyService } from "./knowledge-exchange-contract.service";
import { KnowledgeExchangeRegistryService } from "./knowledge-exchange-registry.service";
import { KnowledgeExchangeRoutingService } from "./knowledge-exchange-routing.service";
import { KnowledgeExchangeRuntimeService } from "./knowledge-exchange-runtime.service";
import { KnowledgeExchangeChannel, KnowledgeExchangeParticipant } from "./knowledge-exchange.types";

@Controller("knowledge-fabric/exchange")
export class KnowledgeExchangeController {
  constructor(
    private readonly registry: KnowledgeExchangeRegistryService,
    private readonly routing: KnowledgeExchangeRoutingService,
    private readonly contracts: KnowledgeExchangePolicyService,
    private readonly runtime: KnowledgeExchangeRuntimeService,
    private readonly health: KnowledgeExchangeHealthService,
  ) {}

  @Get("status") status() { return this.health.status(); }
  @Get("channels") channels() { return this.registry.listChannels(); }
  @Get("participants") participants() { return this.registry.listParticipants(); }
  @Get("offers") offers() { return this.routing.list(); }
  @Get("contracts") contractsList() { return this.contracts.list(); }

  @Post("channels") registerChannel(@Body() body: Parameters<KnowledgeExchangeRegistryService["registerChannel"]>[0]) {
    return this.registry.registerChannel(body);
  }

  @Post("participants") registerParticipant(@Body() body: Parameters<KnowledgeExchangeRegistryService["registerParticipant"]>[0]) {
    return this.registry.registerParticipant(body);
  }

  @Patch("participants/:id/state") updateParticipantState(@Param("id") id: string, @Body("state") state: KnowledgeExchangeParticipant["state"]) {
    return this.registry.updateParticipantState(id, state);
  }

  @Patch("channels/:id/state") updateChannelState(@Param("id") id: string, @Body("state") state: KnowledgeExchangeChannel["state"]) {
    return this.registry.updateChannelState(id, state);
  }

  @Post("offers") publishOffer(@Body() body: Parameters<KnowledgeExchangeRoutingService["publishOffer"]>[0]) {
    return this.routing.publishOffer(body);
  }

  @Post("contracts") createContract(@Body() body: Parameters<KnowledgeExchangePolicyService["createContract"]>[0]) {
    return this.contracts.createContract(body);
  }

  @Post("execute") execute(@Body() body: Parameters<KnowledgeExchangeRuntimeService["execute"]>[0]) {
    return this.runtime.execute(body);
  }
}