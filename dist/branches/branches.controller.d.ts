import { BranchesService } from "./branches.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
export declare class BranchesController {
    private service;
    constructor(service: BranchesService);
    findAll(): any;
    create(dto: CreateBranchDto): any;
    update(id: string, dto: UpdateBranchDto): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
