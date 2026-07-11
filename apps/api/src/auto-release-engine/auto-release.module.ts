import { Module } from "@nestjs/common";
import { AutoReleaseService } from "./auto-release.service";

@Module({
  providers:[AutoReleaseService],
  exports:[AutoReleaseService],
})
export class AutoReleaseModule {}
