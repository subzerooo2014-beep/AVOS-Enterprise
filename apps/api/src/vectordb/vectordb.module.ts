import { Module } from "@nestjs/common";
import { VectordbController } from "./vectordb.controller";
import { VectordbService } from "./vectordb.service";

@Module({
  controllers:[VectordbController],
  providers:[VectordbService],
})
export class VectordbModule{}
