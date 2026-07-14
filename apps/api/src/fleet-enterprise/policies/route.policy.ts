import { Injectable } from "@nestjs/common";
@Injectable()
export class RoutePolicy {
  validate(stops: string[]) {
    if (stops.length < 2) throw new Error("Route requires at least two stops");
    return true;
  }
}
