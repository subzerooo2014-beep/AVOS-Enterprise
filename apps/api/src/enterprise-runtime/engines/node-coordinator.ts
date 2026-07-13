import { Injectable } from "@nestjs/common";

@Injectable()
export class NodeCoordinator {
  nodes() {
    return {
      activeNodes: 1,
      clusterState: "HEALTHY",
    };
  }
}
