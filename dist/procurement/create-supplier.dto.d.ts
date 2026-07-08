import { SupplierStatus } from './procurement.enums';
export declare class CreateSupplierDto {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: SupplierStatus;
}
