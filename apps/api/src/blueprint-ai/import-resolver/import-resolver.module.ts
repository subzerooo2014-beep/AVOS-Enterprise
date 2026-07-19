import { Module } from "@nestjs/common";
import { ImportResolverService } from "./import-resolver.service";
import { ImportResolverController } from "./import-resolver.controller";

@Module({
  providers:[ImportResolverService],
  controllers:[ImportResolverController],
  exports:[ImportResolverService]
})
export class ImportResolverModule {}
