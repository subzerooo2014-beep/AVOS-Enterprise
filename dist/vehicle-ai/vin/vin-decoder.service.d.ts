export declare class VinDecoderService {
    decode(vin: string): {
        vin: string;
        manufacturer: string;
        country: string;
        year: null;
        engine: null;
        transmission: null;
        readyForDecoderProvider: boolean;
    };
}
