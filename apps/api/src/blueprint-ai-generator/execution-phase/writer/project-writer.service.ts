import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectWriterService{

  generate(bp:any){
    return {
      target: "src/generated",
      files:[
        "module.ts",
        "service.ts",
        "controller.ts",
        "entity.ts"
      ],
      blueprint: bp
    };
  }
}
