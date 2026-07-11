export interface AvosCommand<T = any> {
  type: string;
  payload?: T;
}
