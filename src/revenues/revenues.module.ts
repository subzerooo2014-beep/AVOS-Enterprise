import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { RevenuesController } from "./revenues.controller";
import { RevenuesService } from "./revenues.service";

@Module({
  imports: [PrismaModule],
  controllers: [RevenuesController],
  providers: [RevenuesService],
})
export class RevenuesModule {}
