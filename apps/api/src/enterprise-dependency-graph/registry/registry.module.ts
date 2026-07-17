import { Module } from "@nestjs/common";
import { DependencyRegistryController } from "./registry.controller";
import { DependencyRegistryService } from "./registry.service";

@Module({ controllers: [DependencyRegistryController], providers: [DependencyRegistryService], exports: [DependencyRegistryService] })
export class DependencyRegistryModule {}