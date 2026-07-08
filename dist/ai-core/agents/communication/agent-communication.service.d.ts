export declare class AgentCommunicationService {
    send(from: string, to: string, message: any): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        from: string;
        to: string;
        message: any;
        sentAt: string;
    };
}
