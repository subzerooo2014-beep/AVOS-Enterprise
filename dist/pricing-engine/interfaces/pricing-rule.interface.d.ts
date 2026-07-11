export interface PricingRuleEntity {
    id: string;
    productId?: string;
    vehicleId?: string;
    type: string;
    value: number;
    active: boolean;
    createdAt: Date;
}
