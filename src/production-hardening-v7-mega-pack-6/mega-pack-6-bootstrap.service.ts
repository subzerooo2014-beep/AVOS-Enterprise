import {
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import {
  MEGA_PACK_6_COLLECTIONS,
  MEGA_PACK_6_SYSTEM,
} from "./constants/mega-pack-6.constants";
import { ComplianceBaselineService } from "./compliance-baseline.service";
import { ControlSchedulerService } from "./control-scheduler.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";

@Injectable()
export class MegaPack6BootstrapService
  implements OnModuleInit
{
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly baselines:
      ComplianceBaselineService,
    private readonly scheduler:
      ControlSchedulerService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureCollections();
  }

  async bootstrap(): Promise<Record<string, unknown>> {
    await this.ensureCollections();

    const baselineSeed =
      await this.baselines.seedDefaults();

    const scheduleSeed =
      await this.scheduler.seedDefaults();

    return {
      success: true,
      system: MEGA_PACK_6_SYSTEM.name,
      version: MEGA_PACK_6_SYSTEM.version,
      initializedAt:
        new Date().toISOString(),
      baselineSeed,
      scheduleSeed,
    };
  }

  private async ensureCollections(): Promise<void> {
    await this.storage.ensureCollections(
      Object.values(
        MEGA_PACK_6_COLLECTIONS,
      ),
    );
  }
}
