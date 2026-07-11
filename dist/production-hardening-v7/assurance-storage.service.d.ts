import { OnModuleInit } from "@nestjs/common";
export declare class AssuranceStorageService implements OnModuleInit {
    private readonly logger;
    private readonly storageDirectory;
    onModuleInit(): Promise<void>;
    readCollection<T>(collection: string): Promise<T[]>;
    writeCollection<T>(collection: string, records: T[]): Promise<void>;
    append<T>(collection: string, record: T): Promise<T>;
    replaceById<T extends {
        id: string;
    }>(collection: string, id: string, replacement: T): Promise<T | null>;
    findById<T extends {
        id: string;
    }>(collection: string, id: string): Promise<T | null>;
    removeById<T extends {
        id: string;
    }>(collection: string, id: string): Promise<boolean>;
    collectionCount(collection: string): Promise<number>;
    private normalizeJsonContent;
    private ensureStorageDirectory;
    private getCollectionPath;
    private backupCorruptedCollection;
    private isMissingFileError;
}
