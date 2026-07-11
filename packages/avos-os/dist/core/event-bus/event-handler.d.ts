import { AvosEvent } from "./event";
export interface AvosEventHandler<T = any> {
    supports(event: AvosEvent<T>): boolean;
    handle(event: AvosEvent<T>): Promise<void>;
}
