import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgeDashboardService {
  summary() {
    return {
      knowledgeRecords: 0,
      domains: 0,
      graphNodes: 0,
      graphEdges: 0,
      provenanceRecords: 0,
      academyCourses: 0,
      qualityScore: 100,
      healthStatus: "healthy",
    };
  }
}
