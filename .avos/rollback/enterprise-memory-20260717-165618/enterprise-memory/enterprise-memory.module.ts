
import { Module } from "@nestjs/common";
import { EnterpriseMemoryController } from "./enterprise-memory.controller";
import { EnterpriseMemoryService } from "./services/enterprise-memory.service";

@Module({
  controllers: [EnterpriseMemoryController],
  providers: [EnterpriseMemoryService],
  exports: [EnterpriseMemoryService]
})
export class EnterpriseMemoryModule {}