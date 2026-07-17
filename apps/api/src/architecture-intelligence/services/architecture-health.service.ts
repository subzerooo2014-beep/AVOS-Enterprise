import { Injectable } from "@nestjs/common";
import { ArchitectureAnalysisService } from "./architecture-analysis.service";

@Injectable()
export class ArchitectureHealthService {
  constructor(private readonly analysis: ArchitectureAnalysisService) {}

  getHealth(): ReturnType<ArchitectureAnalysisService["analyze"]> {
    return this.analysis.analyze();
  }
}