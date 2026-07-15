import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ReferenceArchitectureService } from "./reference-architecture.service";
import {
  ArchitectureRegistryEntry,
  RegistryKind,
} from "./reference-architecture.types";

@Controller("reference-architecture")
export class ReferenceArchitectureController {
  constructor(
    private readonly architecture: ReferenceArchitectureService,
  ) {}

  @Get()
  getFramework() {
    return this.architecture.getFramework();
  }

  @Post("entries")
  registerEntry(
    @Body()
    input: Omit<
      ArchitectureRegistryEntry,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.architecture.registerEntry(input);
  }

  @Get("entries")
  listEntries(
    @Query("registryKind") registryKind?: RegistryKind,
    @Query("status") status?: ArchitectureRegistryEntry["status"],
  ) {
    return this.architecture.listEntries({
      registryKind,
      status,
    });
  }

  @Get("entries/:id")
  getEntry(@Param("id") id: string) {
    return this.architecture.getEntry(id);
  }

  @Post("entries/:id/evaluate")
  evaluateEntry(@Param("id") id: string) {
    return this.architecture.evaluateEntry(id);
  }

  @Patch("entries/:id/activate")
  activateEntry(@Param("id") id: string) {
    return this.architecture.activateEntry(id);
  }

  @Patch("entries/:id/deprecate")
  deprecateEntry(@Param("id") id: string) {
    return this.architecture.deprecateEntry(id);
  }

  @Get("entries/:id/dependency-graph")
  dependencyGraph(@Param("id") id: string) {
    return this.architecture.resolveDependencyGraph(id);
  }

  @Get("summary")
  summary() {
    return this.architecture.getRegistrySummary();
  }
}