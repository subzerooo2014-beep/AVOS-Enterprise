export declare class VehiclePublicUrlService {
    private readonly websiteBaseUrl;
    vehicle(slug: string): string;
    canonical(slug: string): string;
    sitemap(): string;
}
