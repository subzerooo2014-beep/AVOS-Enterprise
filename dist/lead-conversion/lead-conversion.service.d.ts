export declare class LeadConversionService {
    convert(leadId: string, customerId: string): {
        leadId: string;
        customerId: string;
        status: string;
        convertedAt: Date;
    };
}
