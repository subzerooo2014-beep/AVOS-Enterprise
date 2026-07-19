import { Module } from "@nestjs/common";
import { CompilerRegistryService } from "./compiler-registry.service";
import { CompilerRegistryController } from "./compiler-registry.controller";

@Module({
  providers:[CompilerRegistryService],
  controllers:[CompilerRegistryController],
  exports:[CompilerRegistryService]
})
export class CompilerRegistryModule {}
