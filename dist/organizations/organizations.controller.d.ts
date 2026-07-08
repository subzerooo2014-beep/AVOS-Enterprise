import { OrganizationsService } from "./organizations.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
export declare class OrganizationsController {
    private service;
    constructor(service: OrganizationsService);
    findAll(): any;
    create(dto: CreateOrganizationDto): any;
    update(id: string, dto: UpdateOrganizationDto): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
