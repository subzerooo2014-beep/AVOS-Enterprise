import {
  Body,
  Controller,
  Get,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryIntegrationTarget
} from "./avos-factory-integration.contracts";
import {
  AvosFactoryDigitalDNAService
} from "./avos-factory-digital-dna.service";
import {
  AvosFactoryEnterpriseBridgeService
} from "./avos-factory-enterprise-bridge.service";
import {
  AvosFactoryIntegrationRegistryService
} from "./avos-factory-integration-registry.service";
import {
  AvosFactoryIntegrationVerificationService
} from "./avos-factory-integration-verification.service";
import {
  AvosFactoryLivingBlueprintService
} from "./avos-factory-living-blueprint.service";

@Controller("avos/factory/v1/integration")
export class AvosFactoryIntegrationController {
  constructor(
    private readonly registry:
      AvosFactoryIntegrationRegistryService,
    private readonly bridge:
      AvosFactoryEnterpriseBridgeService,
    private readonly blueprint:
      AvosFactoryLivingBlueprintService,
    private readonly digitalDNA:
      AvosFactoryDigitalDNAService,
    private readonly verification:
      AvosFactoryIntegrationVerificationService
  ) {}

  @Get("registry")
  registryStatus() {
    return this.registry.getRegistry();
  }

  @Post("registry/refresh")
  refreshRegistry() {
    return this.registry.refresh();
  }

  @Post("bootstrap")
  bootstrap(
    @Body() input: {
      actor: string;
      humanApproved: boolean;
      approvedBy: string;
    }
  ) {
    return this.bridge.bootstrap(input);
  }

  @Post("connect")
  connect(
    @Body() input: {
      target: AvosFactoryIntegrationTarget;
      actor: string;
      humanApproved: boolean;
      approvedBy: string;
      payload?: Record<string, unknown>;
    }
  ) {
    return this.bridge.connect(input);
  }

  @Get("events")
  events(
    @Query("limit") limit?: string
  ) {
    const parsed =
      Number(limit);

    return {
      items:
        this.bridge.listEvents(
          Number.isFinite(parsed)
            ? Math.trunc(parsed)
            : 100
        )
    };
  }

  @Post("living-blueprint/register")
  registerBlueprint() {
    return this.blueprint.register();
  }

  @Get("living-blueprint/latest")
  latestBlueprint() {
    return {
      blueprint:
        this.blueprint.latest() ?? null
    };
  }

  @Post("digital-dna/generate")
  generateDNA() {
    return this.digitalDNA.generate();
  }

  @Get("digital-dna/latest")
  latestDNA() {
    return {
      digitalDNA:
        this.digitalDNA.latest() ?? null
    };
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }
}
