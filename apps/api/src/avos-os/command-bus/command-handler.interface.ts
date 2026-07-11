import { AvosCommand } from "./command.interface";

export interface CommandHandler {
  supports(command: AvosCommand): boolean;
  handle(command: AvosCommand): Promise<any>;
}
