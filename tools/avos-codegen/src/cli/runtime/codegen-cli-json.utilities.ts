import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";

export function toCodeGenJsonValue(
  value: unknown,
): CodeGenJsonValue {
  return JSON.parse(
    JSON.stringify(value),
  ) as CodeGenJsonValue;
}
