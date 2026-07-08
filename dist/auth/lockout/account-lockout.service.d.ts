export declare class AccountLockoutService {
    private attempts;
    failed(email: string): number;
    reset(email: string): void;
}
