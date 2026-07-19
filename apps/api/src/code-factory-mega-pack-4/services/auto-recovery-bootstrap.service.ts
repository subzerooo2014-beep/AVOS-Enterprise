import {
  Injectable,
  Logger,
  OnApplicationBootstrap
} from "@nestjs/common";
import { WorkspaceRecoveryService } from "./workspace-recovery.service";

@Injectable()
export class AutoRecoveryBootstrapService
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(AutoRecoveryBootstrapService.name);

  constructor(private readonly recovery: WorkspaceRecoveryService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      const recovered = await this.recovery.recoverInterruptedWorkspaces();
      if (recovered.length > 0) {
        this.logger.warn(
          `Recovered ${recovered.length} interrupted Code Factory workspace(s).`
        );
      } else {
        this.logger.log("Persistent workspace recovery scan completed.");
      }
    } catch (error) {
      this.logger.error(
        "Persistent workspace recovery scan failed.",
        error instanceof Error ? error.stack : String(error)
      );
    }
  }
}