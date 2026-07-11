import { CommandBusService } from "./command-bus.service";
import { AvosCommand } from "./command.interface";
export declare class CommandBusController {
    private readonly commandBus;
    constructor(commandBus: CommandBusService);
    execute(command: AvosCommand): Promise<any>;
}
