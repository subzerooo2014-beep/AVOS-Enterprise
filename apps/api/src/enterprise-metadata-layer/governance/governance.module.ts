import { Module } from "@nestjs/common";
import { MetadataGovernanceController } from "./governance.controller";
import { MetadataGovernanceService } from "./governance.service";

@Module({ controllers: [MetadataGovernanceController], providers: [MetadataGovernanceService], exports: [MetadataGovernanceService] })
export class MetadataGovernanceModule {}