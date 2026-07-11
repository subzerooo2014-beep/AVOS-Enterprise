export interface AvosAction {
  type: string;
  priority?: "low" | "medium" | "high";
  payload?: any;
}
