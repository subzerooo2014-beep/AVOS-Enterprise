import { Module } from "@nestjs/common";
import { DependencyScannerController } from "./scanner.controller";
import { DependencyScannerService } from "./scanner.service";

@Module({ controllers: [DependencyScannerController], providers: [DependencyScannerService], exports: [DependencyScannerService] })
export class DependencyScannerModule {}