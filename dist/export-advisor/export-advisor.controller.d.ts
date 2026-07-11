import { ExportAdvisorService } from "./export-advisor.service";
export declare class ExportAdvisorController {
    private service;
    constructor(service: ExportAdvisorService);
    advise(body: any): Promise<any>;
    list(): any;
}
