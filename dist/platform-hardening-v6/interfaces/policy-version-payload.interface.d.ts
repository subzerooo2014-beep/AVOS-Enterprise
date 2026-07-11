export interface PolicyVersionPayload {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    methods: string[];
    pathPrefixes: string[];
    requireApprovalToken: boolean;
    blockInProduction: boolean;
    severity: string;
}
