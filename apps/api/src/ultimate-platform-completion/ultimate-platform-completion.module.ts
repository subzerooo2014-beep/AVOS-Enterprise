import { Module } from "@nestjs/common";
import { UltimatePlatformCompletionController } from "./ultimate-platform-completion.controller";
import { UltimatePlatformCompletionService } from "./ultimate-platform-completion.service";

@Module({
  controllers: [UltimatePlatformCompletionController],
  providers: [UltimatePlatformCompletionService],
  exports: [UltimatePlatformCompletionService],
})
export class UltimatePlatformCompletionModule {}