import { AvosCommand } from "./command";
export interface AvosCommandHandler<T = any, R = any> {
    supports(command: AvosCommand<T>): boolean;
    handle(command: AvosCommand<T>): Promise<R>;
}
