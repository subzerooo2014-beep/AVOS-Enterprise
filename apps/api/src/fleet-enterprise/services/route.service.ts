import { Injectable } from "@nestjs/common";
import { RoutePolicy } from "../policies/route.policy";
@Injectable()
export class RouteService {
  private readonly routes: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: RoutePolicy) {}
  create(input: { fleetId: string; name: string; stops: string[]; estimatedDistanceKm: number }) {
    this.policy.validate(input.stops);
    const route = { id: `route_${Date.now()}`, ...input, status: "ACTIVE" };
    this.routes.push(route);
    return route;
  }
  list() { return [...this.routes]; }
}
