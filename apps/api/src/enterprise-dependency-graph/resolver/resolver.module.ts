import { Module } from "@nestjs/common";
import { DependencyResolverController } from "./resolver.controller";
import { DependencyResolverService } from "./resolver.service";

@Module({ controllers: [DependencyResolverController], providers: [DependencyResolverService], exports: [DependencyResolverService] })
export class DependencyResolverModule {}