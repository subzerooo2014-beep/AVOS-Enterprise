import { Controller, Get } from "@nestjs/common";
import { PublishJobsService } from "./publish-jobs.service";

@Controller("publish-jobs")
export class PublishJobsController{

 constructor(
   private readonly service:PublishJobsService,
 ){}

 @Get()
 all(){

   return this.service.all();

 }

}
