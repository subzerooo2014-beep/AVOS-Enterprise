export declare class PublisherJobIndexService {
    private readonly index;
    put(job: any): void;
    get(id: string): any;
    has(id: string): boolean;
    remove(id: string): void;
    count(): number;
    values(): any[];
}
