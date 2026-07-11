export declare class PublisherPriorityUtil {
    private static readonly weights;
    static normalize(priority?: string | null): string;
    static weight(priority?: string | null): number;
    static compare(a?: string | null, b?: string | null): number;
}
