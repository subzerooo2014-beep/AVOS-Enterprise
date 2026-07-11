import { Module } from "@nestjs/common";
import { AvosKernelService } from "@avos/os";

@Module({
  providers: [AvosKernelService],
  exports: [AvosKernelService],
})
export class AvosOsKernelModule {}
