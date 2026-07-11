import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from "@nestjs/common";
import {
  GovernanceControlMode,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class ProductionHardeningV8MegaPack4Bootstrap
  implements OnApplicationBootstrap
{
  private readonly logger =
    new Logger(
      ProductionHardeningV8MegaPack4Bootstrap.name,
    );

  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  onApplicationBootstrap(): void {
    if (
      !this.store.getControlMode()
    ) {
      this.store.setControlMode(
        GovernanceControlMode.ENFORCE,
      );
    }

    this.logger.log(
      "AVOS Production Hardening V8 — Mega Pack 4 initialized.",
    );
  }
}
