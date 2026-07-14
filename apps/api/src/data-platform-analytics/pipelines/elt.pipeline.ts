import { Injectable } from "@nestjs/common";
@Injectable()
export class EltPipeline {
  run(input: Record<string, unknown>) {
    return { id: "elt_"+Date.now(), input, status: "COMPLETED" };
  }
}
