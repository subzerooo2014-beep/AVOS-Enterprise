import { Injectable, Logger, OnModuleInit } from "@nestjs/common";

@Injectable()
export class AiWorkerService implements OnModuleInit {
  private readonly logger = new Logger(AiWorkerService.name);

  async onModuleInit() {
    this.logger.log("AI Worker temporarily paused during Prisma sync.");
  }
}
