export declare class EmailVerificationService {
    send(email: string): {
        sent: boolean;
        email: string;
    };
    verify(token: string): {
        verified: boolean;
        token: string;
    };
}
