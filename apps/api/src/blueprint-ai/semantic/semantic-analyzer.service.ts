import { Injectable } from "@nestjs/common";

@Injectable()
export class SemanticAnalyzerService {

  analyze(ast:any){
    const entities = (ast.nodes ?? [])
      .filter((n:any)=>n.kind==="Identifier")
      .map((n:any)=>({
        name:n.value,
        type:"Entity"
      }));

    return {
      entities,
      warnings:[],
      errors:[]
    };
  }

}
