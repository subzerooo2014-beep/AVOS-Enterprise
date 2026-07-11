import { AvosQuery } from "./query";

export interface AvosQueryHandler<T = any, R = any> {
  supports(query: AvosQuery<T>): boolean;
  handle(query: AvosQuery<T>): Promise<R>;
}
