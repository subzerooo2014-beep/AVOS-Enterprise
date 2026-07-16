import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { RepositoryRegistryService } from "./repository-registry.service";

@Controller("persistence-foundation/repositories")
export class RepositoryRegistryController {
  constructor(
    private readonly repositoryRegistryService: RepositoryRegistryService,
  ) {}

  @Get("status")
  status() {
    return this.repositoryRegistryService.health();
  }

  @Get("statistics")
  statistics() {
    return {
      success: true,
      statistics: this.repositoryRegistryService.statistics(),
    };
  }

  @Get("dependencies")
  dependencies() {
    return {
      success: true,
      items: this.repositoryRegistryService.dependencyMap(),
    };
  }

  @Post("refresh")
  refresh() {
    const items = this.repositoryRegistryService.refresh();

    return {
      success: true,
      discovered: items.length,
      items,
    };
  }

  @Get()
  list() {
    return {
      success: true,
      items: this.repositoryRegistryService.list(),
    };
  }

  @Get("domain/:domain")
  byDomain(@Param("domain") domain: string) {
    return {
      success: true,
      domain,
      items: this.repositoryRegistryService.findByDomain(domain),
    };
  }

  @Get("resolve/:token")
  resolve(@Param("token") token: string) {
    const resolution = this.repositoryRegistryService.resolve(token);

    if (!resolution.success) {
      throw new NotFoundException(resolution.reason);
    }

    return resolution;
  }

  @Get(":id")
  byId(@Param("id") id: string) {
    const repository = this.repositoryRegistryService.findById(id);

    if (!repository) {
      throw new NotFoundException(`Repository '${id}' was not found.`);
    }

    return {
      success: true,
      repository,
    };
  }
}
