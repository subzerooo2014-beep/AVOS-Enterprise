import { PrismaService } from '../prisma/prisma.service';
import { CatalogQueryDto } from './catalog-query.dto';
import { CreateCatalogItemDto } from './create-catalog-item.dto';
import { UpdateCatalogItemDto } from './update-catalog-item.dto';
export declare class VehicleCatalogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private paginated;
    private findOne;
    brands(query: CatalogQueryDto): Promise<{
        items: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    createBrand(dto: CreateCatalogItemDto): any;
    brand(id: string): Promise<any>;
    updateBrand(id: string, dto: UpdateCatalogItemDto): Promise<any>;
    deleteBrand(id: string): Promise<any>;
    models(query: CatalogQueryDto): Promise<{
        items: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    createModel(dto: CreateCatalogItemDto): Promise<any>;
    model(id: string): Promise<any>;
    updateModel(id: string, dto: UpdateCatalogItemDto): Promise<any>;
    deleteModel(id: string): Promise<any>;
    trims(query: CatalogQueryDto): Promise<{
        items: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    createTrim(dto: CreateCatalogItemDto): Promise<any>;
    trim(id: string): Promise<any>;
    updateTrim(id: string, dto: UpdateCatalogItemDto): Promise<any>;
    deleteTrim(id: string): Promise<any>;
    catalogSummary(): Promise<{
        brands: any;
        models: any;
        trims: any;
        categories: any;
        features: any;
        options: any;
        generatedAt: string;
    }>;
}
