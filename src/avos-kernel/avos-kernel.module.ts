import { Module } from "@nestjs/common";
import { AvosKernelController } from "./avos-kernel.controller";
import { AvosKernelService } from "./avos-kernel.service";

@Module({
  controllers: [AvosKernelController],
  providers: [AvosKernelService],
  exports: [AvosKernelService],
})
export class AvosKernelModule {}
