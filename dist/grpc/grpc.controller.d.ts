import { GrpcService } from "./grpc.service";
export declare class GrpcController {
    private service;
    constructor(service: GrpcService);
    findAll(): never[];
    create(dto: any): any;
}
