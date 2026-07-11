import { PrismaService } from "../../prisma/prisma.service";
import { AvosCommand } from "./command.interface";
import { CommandHandler } from "./command-handler.interface";
export declare class CommandBusService {
    private readonly prisma;
    private handlers;
    constructor(prisma: PrismaService);
    register(handler: CommandHandler): void;
    execute(command: AvosCommand): Promise<any>;
    private logCommand;
}
