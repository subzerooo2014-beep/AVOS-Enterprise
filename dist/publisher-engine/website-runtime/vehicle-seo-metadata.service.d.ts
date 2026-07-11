export declare class VehicleSeoMetadataService {
    create(vehicle: any, publicUrl: string, creative?: any): {
        title: string;
        description: string;
        canonicalUrl: string;
        robots: string;
        keywords: string[];
        openGraph: {
            type: string;
            title: string;
            description: string;
            url: string;
            image: any;
            siteName: string;
            locale: string;
        };
        twitter: {
            card: string;
            title: string;
            description: string;
            image: any;
        };
        structuredData: {
            "@context": string;
            "@type": string;
            name: string;
            url: string;
            vehicleIdentificationNumber: any;
            vehicleModelDate: string | undefined;
            manufacturer: {
                "@type": string;
                name: any;
            } | undefined;
            model: any;
            color: any;
            image: any;
            offers: {
                "@type": string;
                price: any;
                priceCurrency: string;
                availability: string;
                url: string;
            } | undefined;
        };
    };
    private description;
    private limit;
}
