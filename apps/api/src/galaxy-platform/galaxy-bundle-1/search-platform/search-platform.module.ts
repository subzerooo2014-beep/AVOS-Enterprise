import { Module } from "@nestjs/common";
import { SearchPlatformController } from "./search-platform.controller";
import { SearchPlatformService } from "./search-platform.service";

@Module({
  controllers: [SearchPlatformController],
  providers: [SearchPlatformService],
  exports: [SearchPlatformService],
})
export class SearchPlatformModule {}