import { CodeGenCliCommandRegistry } from "../codegen-cli-command-registry";
import { CodeGenCliArgumentParser } from "../parsing/codegen-cli-argument-parser";
import { CodeGenCliOutputFormatter } from "../formatting/codegen-cli-output-formatter";
import { CodeGenCliRuntimeOutput } from "./codegen-cli-runtime.contracts";
export declare class CodeGenCliRuntime {
    readonly registry: CodeGenCliCommandRegistry;
    readonly parser: CodeGenCliArgumentParser;
    readonly formatter: CodeGenCliOutputFormatter;
    constructor(registry?: CodeGenCliCommandRegistry, parser?: CodeGenCliArgumentParser, formatter?: CodeGenCliOutputFormatter);
    run(argv: readonly string[], cwd?: string): Promise<CodeGenCliRuntimeOutput>;
    private registerDefaults;
}
//# sourceMappingURL=codegen-cli-runtime.d.ts.map