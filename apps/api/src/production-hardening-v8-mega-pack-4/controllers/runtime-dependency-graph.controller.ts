import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import {
  CreateDependencyEdgeDto,
  CreateDependencyNodeDto,
  UpdateDependencyHealthDto,
} from "../dto";
import {
  RuntimeDependencyGraphService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/dependencies",
)
export class RuntimeDependencyGraphController {
  constructor(
    private readonly graph:
      RuntimeDependencyGraphService,
  ) {}

  @Post("nodes")
  createNode(
    @Body()
    dto:
      CreateDependencyNodeDto,
  ) {
    return this.graph
      .createNode(dto);
  }

  @Post("edges")
  createEdge(
    @Body()
    dto:
      CreateDependencyEdgeDto,
  ) {
    return this.graph
      .createEdge(dto);
  }

  @Post("nodes/:id/health")
  updateHealth(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateDependencyHealthDto,
  ) {
    return this.graph
      .updateHealth(id, dto);
  }

  @Get("nodes")
  listNodes() {
    return this.graph
      .listNodes();
  }

  @Get("edges")
  listEdges() {
    return this.graph
      .listEdges();
  }

  @Get("nodes/:id")
  getNode(
    @Param("id")
    id: string,
  ) {
    return this.graph
      .getNode(id);
  }

  @Get("edges/:id")
  getEdge(
    @Param("id")
    id: string,
  ) {
    return this.graph
      .getEdge(id);
  }

  @Get("snapshot")
  snapshot(
    @Query("environment")
    environment?: string,
    @Query("namespace")
    namespace?: string,
  ) {
    return this.graph
      .getGraphSnapshot(
        environment,
        namespace,
      );
  }
}
