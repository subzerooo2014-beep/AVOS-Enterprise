import { CodeGenEnterpriseEndToEndRequest } from "../e2e/codegen-enterprise-e2e.contracts";
import { CodeGenEnterpriseEndToEndRuntime } from "../e2e/codegen-enterprise-end-to-end-runtime";
export declare class CodeGenEnterpriseRuntimeCliBridge {
    readonly runtime: CodeGenEnterpriseEndToEndRuntime;
    constructor(runtime?: CodeGenEnterpriseEndToEndRuntime);
    execute(request: CodeGenEnterpriseEndToEndRequest): Promise<string>;
}
//# sourceMappingURL=codegen-enterprise-runtime-cli-bridge.d.ts.map