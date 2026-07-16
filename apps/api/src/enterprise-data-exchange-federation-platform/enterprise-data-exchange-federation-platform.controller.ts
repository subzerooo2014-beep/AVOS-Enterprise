import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DataContractRegistryService } from "./data-contract-registry.service";
import { DataExchangeHubService } from "./data-exchange-hub.service";
import { DataMappingEngineService } from "./data-mapping-engine.service";
import { DataSynchronizationService } from "./data-synchronization.service";
import { FederationAnalyticsService } from "./federation-analytics.service";
import { FederationNodeRegistryService } from "./federation-node-registry.service";
import { SchemaRegistryService } from "./schema-registry.service";
import type {
  DataContractRecord,
  DataMappingRecord,
  FederationNodeRecord,
  SchemaDefinitionRecord,
} from "./enterprise-data-exchange-federation.types";

@Controller("enterprise-data-exchange-federation-platform")
export class EnterpriseDataExchangeFederationPlatformController {
  constructor(
    private readonly analytics: FederationAnalyticsService,
    private readonly nodes: FederationNodeRegistryService,
    private readonly schemas: SchemaRegistryService,
    private readonly contracts: DataContractRegistryService,
    private readonly mappings: DataMappingEngineService,
    private readonly exchange: DataExchangeHubService,
    private readonly sync: DataSynchronizationService,
  ) {}

  @Get("status")
  status() {
    return this.analytics.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.analytics.diagnostics();
  }

  @Post("nodes")
  registerNode(
    @Body() body: Omit<FederationNodeRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, node: this.nodes.register(body) };
  }

  @Post("schemas")
  registerSchema(
    @Body()
    body: Omit<SchemaDefinitionRecord, "version" | "createdAt" | "updatedAt">,
  ) {
    return { success: true, schema: this.schemas.register(body) };
  }

  @Post("contracts")
  registerContract(
    @Body() body: Omit<DataContractRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, contract: this.contracts.register(body) };
  }

  @Post("mappings")
  registerMapping(
    @Body() body: Omit<DataMappingRecord, "version" | "createdAt">,
  ) {
    return { success: true, mapping: this.mappings.register(body) };
  }

  @Post("messages")
  publish(
    @Body()
    body: {
      contractId: string;
      sourceNodeId: string;
      targetNodeId: string;
      payload: Record<string, unknown>;
      requiredFields?: string[];
    },
  ) {
    return {
      success: true,
      message: this.exchange.publish(
        body.contractId,
        body.sourceNodeId,
        body.targetNodeId,
        body.payload,
        body.requiredFields,
      ),
    };
  }

  @Post("messages/:id/deliver")
  deliver(@Param("id") id: string) {
    return { success: true, message: this.exchange.deliver(id) };
  }

  @Post("messages/:id/fail")
  fail(
    @Param("id") id: string,
    @Body() body: { error: string },
  ) {
    return { success: true, message: this.exchange.fail(id, body.error) };
  }

  @Post("synchronizations")
  synchronize(
    @Body()
    body: {
      sourceNodeId: string;
      targetNodeId: string;
      contractId: string;
      recordsRead: number;
      recordsWritten: number;
      error?: string;
    },
  ) {
    return {
      success: true,
      synchronization: this.sync.run(
        body.sourceNodeId,
        body.targetNodeId,
        body.contractId,
        body.recordsRead,
        body.recordsWritten,
        body.error,
      ),
    };
  }
}
