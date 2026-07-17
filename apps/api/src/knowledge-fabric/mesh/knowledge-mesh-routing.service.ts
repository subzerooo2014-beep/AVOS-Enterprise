import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeMeshRoute } from "./knowledge-mesh.types";

@Injectable()
export class KnowledgeMeshRoutingService {
  private readonly routes: KnowledgeMeshRoute[] = [];
  private cursor = 0;

  addRoute(input: Omit<KnowledgeMeshRoute, "id" | "createdAt">): KnowledgeMeshRoute {
    const route: KnowledgeMeshRoute = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    this.routes.push(route);
    return route;
  }

  resolve(namespace: string): KnowledgeMeshRoute[] {
    return this.routes
      .filter((route) => route.enabled && route.namespace === namespace)
      .sort((left, right) => left.priority - right.priority);
  }

  select(namespace: string): KnowledgeMeshRoute | undefined {
    const routes = this.resolve(namespace);
    if (routes.length === 0) return undefined;
    if (routes[0].strategy !== "ROUND_ROBIN") return routes[0];
    const selected = routes[this.cursor % routes.length];
    this.cursor += 1;
    return selected;
  }

  list(): KnowledgeMeshRoute[] { return [...this.routes]; }
  count(): number { return this.routes.length; }
}