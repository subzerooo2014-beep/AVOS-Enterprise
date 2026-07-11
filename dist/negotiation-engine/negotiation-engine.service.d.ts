import { PrismaService } from "../prisma/prisma.service";
export declare class NegotiationEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    createSession(data: any): any;
    counterOffer(id: string, body: any): Promise<any>;
    list(): any;
}
