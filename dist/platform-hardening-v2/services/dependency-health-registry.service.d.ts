import { OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DependencyCheckExecutor } from "../contracts/dependency-check.contract";
import { DependencyCheckResult } from "../interfaces/dependency-check.interface";
export declare class DependencyHealthRegistryService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    private readonly checks;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    register(configuration: {
        name: string;
        critical: boolean;
        timeoutMs?: number;
        executor: DependencyCheckExecutor;
    }): void;
    unregister(name: string): boolean;
    listRegisteredChecks(): Array<{
        name: string;
        critical: boolean;
        timeoutMs: number;
    }>;
    runAll(): Promise<DependencyCheckResult[]>;
    runOne(name: string): Promise<DependencyCheckResult | null>;
    private executeCheck;
    private elapsedMilliseconds;
}
