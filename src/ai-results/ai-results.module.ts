import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AiResultsController } from "./ai-results.controller";
import { AiResultsService } from "./ai-results.service";

@Module({
  imports: [PrismaModule],
  controllers: [AiResultsController],
  providers: [AiResultsService],
  exports: [AiResultsService],
})
export class AiResultsModule {}
