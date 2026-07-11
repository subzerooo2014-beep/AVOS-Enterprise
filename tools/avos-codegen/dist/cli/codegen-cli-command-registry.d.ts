import { CodeGenCliCommand } from "./codegen-cli.contracts";
export declare class CodeGenCliCommandRegistry {
    private readonly commands;
    register(command: CodeGenCliCommand, replace?: boolean): CodeGenCliCommand;
    get(key: string): CodeGenCliCommand;
    list(): CodeGenCliCommand[];
    has(key: string): boolean;
    clear(): void;
}
//# sourceMappingURL=codegen-cli-command-registry.d.ts.map