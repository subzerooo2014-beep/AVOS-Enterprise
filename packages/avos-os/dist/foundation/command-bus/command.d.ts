import { AvosContext } from "../types/context";
export interface AvosCommand<T = any> {
    type: string;
    payload: T;
    context?: AvosContext;
}
