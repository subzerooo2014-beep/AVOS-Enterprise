import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
} from "node:path";
import {
  CodeGenQualityReport,
} from "../contracts/codegen-quality.contracts";

export class CodeGenQualityReportWriter {
  async write(
    filePath: string,
    report:
      CodeGenQualityReport,
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
