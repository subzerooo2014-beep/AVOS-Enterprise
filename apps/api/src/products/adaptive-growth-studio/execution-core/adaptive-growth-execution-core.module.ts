import { Module } from "@nestjs/common";
import { AdaptiveGrowthActionDispatcherService } from "./adaptive-growth-action-dispatcher.service";
import { AdaptiveGrowthActionRegistryService } from "./adaptive-growth-action-registry.service";
import { AdaptiveGrowthActionService } from "./adaptive-growth-action.service";
import { AdaptiveGrowthActionValidatorService } from "./adaptive-growth-action-validator.service";
import { AdaptiveGrowthExecutionCoreController } from "./adaptive-growth-execution-core.controller";
import { AdaptiveGrowthExecutionCoreService } from "./adaptive-growth-execution-core.service";
import { AdaptiveGrowthExecutionEngineService } from "./adaptive-growth-execution-engine.service";
import { AdaptiveGrowthExecutionHistoryService } from "./adaptive-growth-execution-history.service";
import { AdaptiveGrowthExecutionIdService } from "./adaptive-growth-execution-id.service";
import { AdaptiveGrowthExecutionStateMachineService } from "./adaptive-growth-execution-state-machine.service";
import { AdaptiveGrowthExecutionStoreService } from "./adaptive-growth-execution-store.service";
import { AdaptiveGrowthExecutionVerificationController } from "./adaptive-growth-execution-verification.controller";
import { AdaptiveGrowthExecutionVerificationService } from "./adaptive-growth-execution-verification.service";
import { AdaptiveGrowthRollbackEngineService } from "./adaptive-growth-rollback-engine.service";

@Module({
  controllers: [
    AdaptiveGrowthExecutionCoreController,
    AdaptiveGrowthExecutionVerificationController,
  ],
  providers: [
    AdaptiveGrowthExecutionIdService,
    AdaptiveGrowthActionRegistryService,
    AdaptiveGrowthExecutionStateMachineService,
    AdaptiveGrowthExecutionHistoryService,
    AdaptiveGrowthExecutionStoreService,
    AdaptiveGrowthActionValidatorService,
    AdaptiveGrowthActionService,
    AdaptiveGrowthActionDispatcherService,
    AdaptiveGrowthExecutionEngineService,
    AdaptiveGrowthRollbackEngineService,
    AdaptiveGrowthExecutionCoreService,
    AdaptiveGrowthExecutionVerificationService,
  ],
  exports: [
    AdaptiveGrowthActionRegistryService,
    AdaptiveGrowthActionService,
    AdaptiveGrowthExecutionEngineService,
    AdaptiveGrowthRollbackEngineService,
    AdaptiveGrowthExecutionCoreService,
  ],
})
export class AdaptiveGrowthExecutionCoreModule {}