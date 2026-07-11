import { AvosDnaService } from "./avos-dna.service";
export declare class AvosDnaController {
    private service;
    constructor(service: AvosDnaService);
    seed(): Promise<any[]>;
    list(): any;
}
