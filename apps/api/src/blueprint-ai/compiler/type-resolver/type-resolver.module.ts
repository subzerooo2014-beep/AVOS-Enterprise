import { Module } from "@nestjs/common";
import { TypeResolverService } from "./type-resolver.service";
import { TypeResolverController } from "./type-resolver.controller";

@Module({
  providers:[TypeResolverService],
  controllers:[TypeResolverController],
  exports:[TypeResolverService]
})
export class TypeResolverModule {}
