import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherJobAdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        success: boolean;
        message: string;
        job?: undefined;
    } | {
        success: boolean;
        job: any;
        message?: undefined;
    }>;
    createMany(items: any[]): Promise<{
        success: boolean;
        requested: number;
        created: number;
        jobs: any[];
    }>;
    list(query: any): Promise<{
        success: boolean;
        count: any;
        jobs: any;
    }>;
    get(id: string): Promise<{
        success: boolean;
        message: string;
        job?: undefined;
    } | {
        success: boolean;
        job: any;
        message?: undefined;
    }>;
    cancel(id: string): Promise<{
        success: boolean;
        message: string;
        job?: undefined;
    } | {
        success: boolean;
        job: any;
        message?: undefined;
    }>;
    retry(id: string): Promise<{
        success: boolean;
        message: string;
        job?: undefined;
    } | {
        success: boolean;
        job: any;
        message?: undefined;
    }>;
    retryFailed(limit?: number): Promise<{
        success: boolean;
        retried: number;
        jobs: any[];
    }>;
}
