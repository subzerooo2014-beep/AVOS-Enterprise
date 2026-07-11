export declare class GovernanceSignaturePayloadService {
    audit(event: any): {
        id: any;
        sequence: any;
        eventType: any;
        severity: any;
        action: any;
        message: any;
        actor: any;
        correlationId: any;
        traceId: any;
        method: any;
        path: any;
        statusCode: any;
        metadata: any;
        previousHash: any;
        hash: any;
        createdAt: string;
    };
    policy(version: any): {
        id: any;
        policyId: any;
        version: any;
        name: any;
        description: any;
        enabled: any;
        methods: any;
        pathPrefixes: any;
        requireApprovalToken: any;
        blockInProduction: any;
        severity: any;
        changeType: any;
        changeReason: any;
        changedBy: any;
        correlationId: any;
        traceId: any;
        restoredFromVersion: any;
        checksum: any;
        createdAt: string;
    };
    private toIso;
}
