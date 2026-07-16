import { Module } from "@nestjs/common";
import { RepositoryDiscoveryService } from "./repository-discovery.service";
import { RepositoryRegistryController } from "./repository-registry.controller";
import { RepositoryRegistryService } from "./repository-registry.service";

@Module({
  controllers: [RepositoryRegistryController],
  providers: [RepositoryDiscoveryService, RepositoryRegistryService],
  exports: [RepositoryDiscoveryService, RepositoryRegistryService],
})
export class RepositoryRegistryModule {}
