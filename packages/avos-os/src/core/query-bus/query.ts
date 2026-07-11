export interface AvosQuery<T = any> {
  type: string;
  payload?: T;
}
