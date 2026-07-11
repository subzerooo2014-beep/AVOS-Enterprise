#!/usr/bin/env node

import {
  CodeGenCliRuntime,
} from "./runtime/codegen-cli-runtime";

async function main():
  Promise<void> {
  const runtime =
    new CodeGenCliRuntime();

  const output =
    await runtime.run(
      process.argv.slice(2),
      process.cwd(),
    );

  const json =
    process.argv.includes(
      "--json",
    );

  process.stdout.write(
    `${runtime.formatter.format(
      output,
      json,
    )}\n`,
  );

  if (!output.success) {
    process.exitCode = 1;
  }
}

void main();
