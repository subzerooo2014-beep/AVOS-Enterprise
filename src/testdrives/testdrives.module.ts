import { Module } from "@nestjs/common";
import { TestdrivesController } from "./testdrives.controller";
import { TestdrivesService } from "./testdrives.service";

@Module({
  controllers:[TestdrivesController],
  providers:[TestdrivesService],
})
export class TestdrivesModule {}
