import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AiActionLogController } from "./ai-action-log.controller";
import { AiActionLogService } from "./ai-action-log.service";

@Module({

 imports:[
  PrismaModule,
 ],

 controllers:[
  AiActionLogController,
 ],

 providers:[
  AiActionLogService,
 ],

 exports:[
  AiActionLogService,
 ]

})

export class AiActionLogModule{}
