import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobExecutionResultService {
  success(context: any, result: any) {
    return {
      success: true,
      context,
      result,
      finishedAt: new Date(),
    };
  }

  failure(context: any, error: any) {
    return {
      success: false,
      context,
      error: error?.message ?? "Execution failed",
      finishedAt: new Date(),
    };
  }
}
