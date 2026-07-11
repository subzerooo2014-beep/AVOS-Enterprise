import {
  resolve,
} from "node:path";
import {
  CodeGenEndToEndSmokeRunner,
} from "./codegen-end-to-end-smoke-runner";

export async function runCodeGenSmoke(
  codegenRoot =
    process.cwd(),
): Promise<void> {
  const runner =
    new CodeGenEndToEndSmokeRunner();

  const result =
    await runner.run(
      resolve(codegenRoot),
    );

  process.stdout.write(
    `${JSON.stringify(result, null, 2)}\n`,
  );

  if (!result.success) {
    process.exitCode = 1;
  }
}
