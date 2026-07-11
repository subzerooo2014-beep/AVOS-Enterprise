import { CodeGenValidationRuntime } from "../runtime/codegen-validation-runtime";
import { CodeGenValidationContext } from "../contracts/codegen-validation.contracts";
export declare class CodeGenValidationCliService {
    readonly runtime: CodeGenValidationRuntime;
    constructor(runtime?: CodeGenValidationRuntime);
    validate(context: CodeGenValidationContext): Promise<string>;
}
//# sourceMappingURL=codegen-validation-cli.service.d.ts.map