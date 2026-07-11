import { BusinessProvidersService } from "./business-providers.service";
export declare class BusinessProvidersController {
    private service;
    constructor(service: BusinessProvidersService);
    createProvider(body: any): any;
    listProviders(type?: string): any;
    findProvider(id: string): Promise<any>;
    updateScore(id: string, body: any): Promise<any>;
    createOffer(body: any): Promise<any>;
    listOffers(serviceType?: string): any;
    matchProvider(body: any): Promise<any>;
    listMatches(): any;
}
