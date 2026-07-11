export declare class PublisherChannelUtil {
    static normalize(channel?: string | null): string;
    static supported(): string[];
    static exists(channel?: string | null): boolean;
    static fallback(channel?: string | null): string;
}
