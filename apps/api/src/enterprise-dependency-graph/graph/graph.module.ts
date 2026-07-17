import { Module } from "@nestjs/common";
import { DependencyGraphController } from "./graph.controller";
import { DependencyGraphService } from "./graph.service";

@Module({ controllers: [DependencyGraphController], providers: [DependencyGraphService], exports: [DependencyGraphService] })
export class DependencyGraphModule {}