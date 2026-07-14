import { Injectable } from "@nestjs/common";
@Injectable()
export class TimeseriesPipeline {
  run(input: Record<string, unknown>) {
    return { id: "timeseries_"+Date.now(), input, status: "COMPLETED" };
  }
}
