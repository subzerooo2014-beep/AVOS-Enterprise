import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
  join,
} from "node:path";
import {
  CodeGenGenerationReport,
} from "../codegen-output.contracts";

export class CodeGenGenerationReportEngine {
  async write(
    report:
      CodeGenGenerationReport,
    targetRoot: string,
    filePath?: string,
  ): Promise<string> {
    const outputPath =
      filePath ??
      join(
        targetRoot,
        ".avos-codegen",
        "generation-report.json",
      );

    await mkdir(
      dirname(outputPath),
      {
        recursive: true,
      },
    );

    await writeFile(
      outputPath,
      JSON.stringify(
        report,
        null,
        2,
      ),
      "utf8",
    );

    return outputPath;
  }
}
