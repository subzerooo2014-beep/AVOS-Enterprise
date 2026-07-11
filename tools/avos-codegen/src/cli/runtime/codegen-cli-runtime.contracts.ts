import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";

export interface CodeGenCliParsedInput {
  command: string;
  args: string[];
  options: Record<string, CodeGenJsonValue>;
}

export interface CodeGenCliRuntimeOutput {
  success: boolean;
  command: string;
  message: string;
  data?: CodeGenJsonValue;
  errors: string[];
  warnings: string[];
  executedAt: string;
}

export interface CodeGenCliRuntimeContext {
  cwd: string;
  codegenRoot: string;
  parsed: CodeGenCliParsedInput;
}
