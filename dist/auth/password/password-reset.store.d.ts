export declare class PasswordResetStore {
    private static readonly tokens;
    static create(email: string): `${string}-${string}-${string}-${string}-${string}`;
    static consume(token: string): string | undefined;
}
