import { Injectable } from "@nestjs/common";

@Injectable()
export class CapabilityGraphService {

  execute(input: unknown){
    return {
      module: "capability-graph",
      status: "implemented",
      received: input,
      timestamp: new Date().toISOString()
    };
  }

}
