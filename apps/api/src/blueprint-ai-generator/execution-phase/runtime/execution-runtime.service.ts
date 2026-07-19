import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutionRuntimeService{

  execute(prompt:string){
    return {
      accepted:true,
      prompt,
      pipeline:[
        "Analyze",
        "Blueprint",
        "Generate",
        "Write"
      ]
    };
  }
}
