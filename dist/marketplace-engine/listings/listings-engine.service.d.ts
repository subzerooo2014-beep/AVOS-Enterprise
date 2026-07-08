export declare class ListingsEngineService {
    publish(vehicle: any): {
        listingId: `${string}-${string}-${string}-${string}-${string}`;
        status: string;
        vehicle: any;
        publishedAt: string;
    };
    unpublish(id: string): {
        listingId: string;
        status: string;
    };
}
