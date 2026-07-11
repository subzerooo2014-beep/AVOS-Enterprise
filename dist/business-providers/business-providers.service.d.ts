import { PrismaService } from "../prisma/prisma.service";
export declare class BusinessProvidersService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    createProvider(data: any): any;
    listProviders(type?: string): any;
    findProvider(id: string): Promise<any>;
    updateProviderScore(id: string, metrics?: any): Promise<any>;
    createOffer(data: any): Promise<any>;
    listOffers(serviceType?: string): any;
    matchProvider(data: any): Promise<any>;
    listMatches(): any;
}
