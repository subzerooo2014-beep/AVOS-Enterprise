import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
} from "node:path";
import {
  CodeGenValidationReport,
} from "../contracts/codegen-validation.contracts";

export class CodeGenValidationReportWriter {
  async write(
    filePath: string,
    report:
      CodeGenValidationReport,
  ): Promise<string> {
    await mkdir(
      dirname(filePath),
      {
        recursive: true,
      },
    );

    await writeFile(
      filePath,
      JSON.stringify(
        report,
        null,
        2,
      ),
      "utf8",
    );

    return filePath;
  }
}
