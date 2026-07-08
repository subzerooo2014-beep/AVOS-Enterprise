export declare class SessionService {
    private sessions;
    create(userId: string, token: string): string;
    find(token: string): any;
    revoke(token: string): boolean;
}
