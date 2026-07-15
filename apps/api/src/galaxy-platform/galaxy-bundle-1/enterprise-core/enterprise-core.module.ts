import { Module } from "@nestjs/common";
import { EnterpriseCoreController } from "./enterprise-core.controller";
import { EnterpriseCoreService } from "./enterprise-core.service";

@Module({
  controllers: [EnterpriseCoreController],
  providers: [EnterpriseCoreService],
  exports: [EnterpriseCoreService],
})
export class EnterpriseCoreModule {}