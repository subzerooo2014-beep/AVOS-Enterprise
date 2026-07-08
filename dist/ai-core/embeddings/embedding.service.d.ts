export declare class EmbeddingService {
    embed(text: string): Promise<{
        dimensions: number;
        vector: number[];
    }>;
}
