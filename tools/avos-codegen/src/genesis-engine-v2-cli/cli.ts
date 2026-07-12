#!/usr/bin/env node

import { GenesisCliRunner } from "./cli-runner";

async function main(): Promise<void> {
  const specificationPath = process.argv[2];

  if (!specificationPath) {
    console.error(
      JSON.stringify(
        {
          success: false,
          error:
            "Usage: node dist/genesis-engine-v2-cli/cli.js <specification.json>",
        },
        null,
        2,
      ),
    );
    process.exitCode = 2;
    return;
  }

  try {
    const result = await new GenesisCliRunner().run(
      specificationPath,
    );

    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.success ? 0 : 1;
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unknown Genesis CLI failure.",
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  }
}

void main();
