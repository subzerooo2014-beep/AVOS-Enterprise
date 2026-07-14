import { Injectable } from "@nestjs/common";
@Injectable()
export class TripPolicy {
  validate(origin: string, destination: string) {
    if (!origin || !destination) throw new Error("Trip route required");
    if (origin === destination) throw new Error("Origin and destination cannot match");
    return true;
  }
}
