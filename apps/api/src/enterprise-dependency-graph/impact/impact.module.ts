import { Module } from "@nestjs/common";
import { DependencyImpactController } from "./impact.controller";
import { DependencyImpactService } from "./impact.service";

@Module({ controllers: [DependencyImpactController], providers: [DependencyImpactService], exports: [DependencyImpactService] })
export class DependencyImpactModule {}