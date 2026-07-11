import {
  Module,
} from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { AiCampaignManagerService } from "./ai-campaign-manager.service";
import { AiCampaignLaunchService } from "./ai-campaign-launch.service";
import { AiCampaignLaunchController } from "./ai-campaign-launch.controller";
import { AiCampaignManagerController } from "./ai-campaign-manager.controller";

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    AiCampaignManagerController,
    AiCampaignLaunchController,
  ],

  providers: [
    AiCampaignManagerService,
    AiCampaignLaunchService,
  ],

  exports: [
    AiCampaignManagerService,
    AiCampaignLaunchService,
  ],
})
export class AiCampaignManagerModule {}

