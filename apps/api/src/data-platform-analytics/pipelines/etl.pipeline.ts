import { Injectable } from "@nestjs/common";
@Injectable()
export class EtlPipeline {
  run(input: Record<string, unknown>) {
    return { id: "etl_"+Date.now(), input, status: "COMPLETED" };
  }
}
