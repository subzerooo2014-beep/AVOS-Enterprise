import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PublishJobsController } from "./publish-jobs.controller";
import { PublishJobsService } from "./publish-jobs.service";

@Module({

 imports:[
  PrismaModule,
 ],

 controllers:[
  PublishJobsController,
 ],

 providers:[
  PublishJobsService,
 ],

 exports:[
  PublishJobsService,
 ]

})

export class PublishJobsModule{}
