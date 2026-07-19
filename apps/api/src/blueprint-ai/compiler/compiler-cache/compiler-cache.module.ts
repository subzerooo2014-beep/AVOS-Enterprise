import { Module } from "@nestjs/common";
import { CompilerCacheService } from "./compiler-cache.service";
import { CompilerCacheController } from "./compiler-cache.controller";

@Module({
  providers:[CompilerCacheService],
  controllers:[CompilerCacheController],
  exports:[CompilerCacheService]
})
export class CompilerCacheModule {}
