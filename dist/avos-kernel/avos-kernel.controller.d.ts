import { AvosKernelService } from "./avos-kernel.service";
export declare class AvosKernelController {
    private service;
    constructor(service: AvosKernelService);
    decide(body: any): Promise<any>;
    list(): any;
}
