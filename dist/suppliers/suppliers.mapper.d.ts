import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
export declare class SuppliersMapper {
    toCreateData(dto: CreateSupplierDto): {
        name: string;
        email: string | undefined;
        phone: string | undefined;
        address: string | undefined;
        notes: string | undefined;
    };
    toUpdateData(dto: UpdateSupplierDto): {
        name: string | undefined;
        email: string | undefined;
        phone: string | undefined;
        address: string | undefined;
        notes: string | undefined;
    };
}
