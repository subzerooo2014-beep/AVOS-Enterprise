import { OnModuleInit } from "@nestjs/common";
export declare class MegaPack6StorageService implements OnModuleInit {
    private readonly logger;
    private readonly root;
    private writeQueue;
    onModuleInit(): Promise<void>;
    readCollection<T>(collection: string): Promise<T[]>;
    writeCollection<T>(collection: string, records: T[]): Promise<void>;
    append<T>(collection: string, record: T): Promise<T>;
    findById<T extends {
        id: string;
    }>(collection: string, id: string): Promise<T | null>;
    replaceById<T extends {
        id: string;
    }>(collection: string, id: string, replacement: T): Promise<T | null>;
    mutateCollection<T>(collection: string, mutator: (records: T[]) => Promise<T[]> | T[]): Promise<T[]>;
    count(collection: string): Promise<number>;
    ensureCollections(collections: string[]): Promise<void>;
    private collectionPath;
    private backupInvalidFile;
    private isMissingFile;
}
