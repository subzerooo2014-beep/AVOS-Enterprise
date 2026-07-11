import { PrismaService } from "../../prisma/prisma.service";
import { AvosEvent } from "../contracts/avos-event.interface";
export declare class DeadLetterService {
    private prisma;
    constructor(prisma: PrismaService);
    capture(event: AvosEvent, error: any): Promise<void>;
}
