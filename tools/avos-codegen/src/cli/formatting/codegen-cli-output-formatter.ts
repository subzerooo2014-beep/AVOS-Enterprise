import {
  CodeGenCliRuntimeOutput,
} from "../runtime/codegen-cli-runtime.contracts";

export class CodeGenCliOutputFormatter {
  format(
    output:
      CodeGenCliRuntimeOutput,
    json = false,
  ): string {
    if (json) {
      return JSON.stringify(
        output,
        null,
        2,
      );
    }

    const lines = [
      output.success
        ? "SUCCESS"
        : "FAILED",
      output.message,
    ];

    if (
      output.data !==
      undefined
    ) {
      lines.push(
        JSON.stringify(
          output.data,
          null,
          2,
        ),
      );
    }

    if (
      output.warnings.length >
      0
    ) {
      lines.push(
        "Warnings:",
        ...output.warnings.map(
          (warning) =>
            `- ${warning}`,
        ),
      );
    }

    if (
      output.errors.length >
      0
    ) {
      lines.push(
        "Errors:",
        ...output.errors.map(
          (error) =>
            `- ${error}`,
        ),
      );
    }

    return lines.join("\n");
  }
}
