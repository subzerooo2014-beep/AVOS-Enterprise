import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  MeshRequest,
  MeshResult
} from "../contracts/enterprise-intelligence-mesh.contracts";

@Injectable()
export class MeshMemoryService {
  private readonly requests = new Map<string, MeshRequest>();
  private readonly results = new Map<string, MeshResult>();

  saveRequest(request: MeshRequest): MeshRequest {
    this.requests.set(request.id, request);
    return request;
  }

  saveResult(result: MeshResult): MeshResult {
    this.results.set(result.requestId, result);
    return result;
  }

  getRequest(id: string): MeshRequest {
    const request = this.requests.get(id);
    if (!request) {
      throw new NotFoundException(`Mesh request not found: ${id}`);
    }
    return request;
  }

  getResult(id: string): MeshResult {
    const result = this.results.get(id);
    if (!result) {
      throw new NotFoundException(`Mesh result not found: ${id}`);
    }
    return result;
  }

  listRequests(): MeshRequest[] {
    return [...this.requests.values()].slice().reverse();
  }

  listResults(): MeshResult[] {
    return [...this.results.values()].slice().reverse();
  }

  metrics(): {
    requests: number;
    completed: number;
    failed: number;
  } {
    const results = this.listResults();
    return {
      requests: this.requests.size,
      completed: results.filter((item) => item.status === "completed").length,
      failed: results.filter((item) => item.status === "failed").length
    };
  }
}