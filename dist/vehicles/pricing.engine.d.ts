export declare class PricingEngine {
    static calculate(price: number, tax: number, discount: number): {
        subtotal: number;
        tax: number;
        total: number;
    };
}
