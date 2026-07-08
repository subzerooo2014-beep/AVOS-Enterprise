import { ContractStatus, SalesStatus } from '../constants/sales.enums';
export declare class SalesQueryDto {
    search?: string;
    quoteStatus?: SalesStatus;
    contractStatus?: ContractStatus;
    page?: number;
    limit?: number;
}
