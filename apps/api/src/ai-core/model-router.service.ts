import { Injectable } from "@nestjs/common";

@Injectable()
export class ModelRouterService {
  selectModel(task?: string) {
    if (task?.includes("vision")) return "vision-model";
    if (task?.includes("pricing")) return "pricing-model";
    if (task?.includes("risk")) return "risk-model";
    return "general-model";
  }
}
