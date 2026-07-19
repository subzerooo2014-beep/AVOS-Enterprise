import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowRuntimeService {

  execute(input: unknown){
    return {
      module: "workflow-runtime",
      status: "implemented",
      received: input,
      timestamp: new Date().toISOString()
    };
  }

}
