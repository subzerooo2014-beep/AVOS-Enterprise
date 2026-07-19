import { Module } from "@nestjs/common";
import { DependencyResolverService } from "./dependency-resolver.service";
import { DependencyResolverController } from "./dependency-resolver.controller";

@Module({
  providers:[DependencyResolverService],
  controllers:[DependencyResolverController],
  exports:[DependencyResolverService]
})
export class DependencyResolverModule {}
