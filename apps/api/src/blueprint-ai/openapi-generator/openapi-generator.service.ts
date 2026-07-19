import { Injectable } from "@nestjs/common";

@Injectable()
export class OpenapiGeneratorService {

  execute(input: unknown){
    return {
      module: "openapi-generator",
      status: "implemented",
      received: input,
      timestamp: new Date().toISOString()
    };
  }

}
