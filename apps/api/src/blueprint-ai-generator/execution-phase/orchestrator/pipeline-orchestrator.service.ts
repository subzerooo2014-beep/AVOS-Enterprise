import { Injectable } from "@nestjs/common";

@Injectable()
export class PipelineOrchestratorService{

 execute(prompt:string){

   const stages=[
     "Prompt Analysis",
     "Blueprint Compilation",
     "NestJS Generation",
     "CRUD Generation",
     "Prisma Generation",
     "Artifact Packaging"
   ];

   return {
     prompt,
     completed:stages.map((name,index)=>({
       order:index+1,
       name,
       status:"queued"
     })),
     startedAt:new Date().toISOString()
   };
 }

}
