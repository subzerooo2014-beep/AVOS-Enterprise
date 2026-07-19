import { Module } from "@nestjs/common";
import { ScopeResolverService } from "./scope-resolver.service";
import { ScopeResolverController } from "./scope-resolver.controller";

@Module({
  providers:[ScopeResolverService],
  controllers:[ScopeResolverController],
  exports:[ScopeResolverService]
})
export class ScopeResolverModule {}
