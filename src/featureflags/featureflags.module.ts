import { Module } from "@nestjs/common";
import { FeatureflagsController } from "./featureflags.controller";
import { FeatureflagsService } from "./featureflags.service";

@Module({
 controllers:[FeatureflagsController],
 providers:[FeatureflagsService],
})
export class FeatureflagsModule{}
