import { Module } from "@nestjs/common";
import { SuperAppV2Controller } from "./super-app-v2.controller";
import { SuperAppV2EventBusService } from "./super-app-v2.event-bus.service";
import { SuperAppV2ParallelRuntimeService } from "./super-app-v2.parallel-runtime.service";

@Module({
  controllers: [SuperAppV2Controller],
  providers: [
    SuperAppV2EventBusService,
    SuperAppV2ParallelRuntimeService,
  ],
  exports: [
    SuperAppV2EventBusService,
    SuperAppV2ParallelRuntimeService,
  ],
})
export class SuperAppV2Module {}