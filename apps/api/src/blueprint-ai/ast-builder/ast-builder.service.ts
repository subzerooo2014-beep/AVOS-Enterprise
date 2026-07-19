import { Injectable } from "@nestjs/common";

@Injectable()
export class AstBuilderService {

  execute(input: unknown){
    return {
      module: "ast-builder",
      status: "implemented",
      received: input,
      timestamp: new Date().toISOString()
    };
  }

}
