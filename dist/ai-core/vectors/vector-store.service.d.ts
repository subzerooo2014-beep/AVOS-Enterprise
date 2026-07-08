export declare class VectorStoreService {
    private store;
    add(id: string, vector: number[], metadata: any): boolean;
    search(vector: number[]): any[];
}
