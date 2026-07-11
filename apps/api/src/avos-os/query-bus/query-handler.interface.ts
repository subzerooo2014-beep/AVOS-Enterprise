import { AvosQuery } from "./query.interface";

export interface QueryHandler {
  supports(query: AvosQuery): boolean;
  handle(query: AvosQuery): Promise<any>;
}
