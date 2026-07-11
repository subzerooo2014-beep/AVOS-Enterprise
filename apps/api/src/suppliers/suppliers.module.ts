import { Module } from "@nestjs/common";
import { SuppliersController } from "./suppliers.controller";
import { SuppliersService } from "./suppliers.service";
import { SuppliersRepository } from "./suppliers.repository";
import { SuppliersPolicy } from "./suppliers.policy";
import { SuppliersMapper } from "./suppliers.mapper";
import { SuppliersSerializer } from "./suppliers.serializer";

@Module({
  controllers: [SuppliersController],
  providers: [
    SuppliersService,
    SuppliersRepository,
    SuppliersPolicy,
    SuppliersMapper,
    SuppliersSerializer,
  ],
  exports: [SuppliersService],
})
export class SuppliersModule {}
