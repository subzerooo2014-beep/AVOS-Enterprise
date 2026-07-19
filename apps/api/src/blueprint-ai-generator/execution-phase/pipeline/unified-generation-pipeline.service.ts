import { Injectable } from "@nestjs/common";

@Injectable()
export class UnifiedGenerationPipelineService{

  run(prompt:string){

    return {
      accepted:true,
      prompt,
      stages:[
        {
          name:"Prompt Analysis",
          status:"completed"
        },
        {
          name:"Blueprint Generation",
          status:"completed"
        },
        {
          name:"NestJS Scaffold",
          status:"planned"
        },
        {
          name:"CRUD Generation",
          status:"planned"
        },
        {
          name:"Prisma Schema",
          status:"planned"
        }
      ],
      generatedAt:new Date().toISOString()
    };
  }

}
