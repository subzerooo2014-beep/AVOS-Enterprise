export declare class LocalStorageService {
    private root;
    write(filename: string, content: string): Promise<{
        filePath: string;
    }>;
}
