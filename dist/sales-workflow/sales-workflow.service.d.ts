export declare class SalesWorkflowService {
    start(referenceId: string): {
        event: string;
        referenceId: string;
        status: string;
        timestamp: Date;
    };
    moveToOrder(referenceId: string): {
        event: string;
        referenceId: string;
        status: string;
        timestamp: Date;
    };
    moveToInvoice(referenceId: string): {
        event: string;
        referenceId: string;
        status: string;
        timestamp: Date;
    };
}
