import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EnterpriseProductionService } from "./enterprise-production.service";

async function main() {
  const service = new EnterpriseProductionService();
  const targetRoot = await mkdtemp(join(tmpdir(), "avos-factory-mp09-"));

  try {
    const job = service.createJob({
      blueprintId: "blueprint:factory-smoke",
      projectName: "factory-smoke-project",
      targetRoot,
      requestedBy: "system:verification",
    });

    const completed = await service.executeJob(job.id, {
      approvedBy: "human:khalifa",
      instructions: [
        {
          relativePath: "src/generated.ts",
          kind: "source",
          content: 'export const generatedBy = "AVOS Factory Mega Pack 9";\n',
        },
        {
          relativePath: "README.md",
          kind: "documentation",
          content: "# AVOS Factory Smoke Project\n",
        },
      ],
    });

    const generated = await readFile(
      join(targetRoot, "src", "generated.ts"),
      "utf8",
    );

    if (completed.status !== "completed") {
      throw new Error(`Unexpected job status: ${completed.status}`);
    }

    if (completed.qualityScore !== 100) {
      throw new Error(`Unexpected quality score: ${completed.qualityScore}`);
    }

    if (!generated.includes("AVOS Factory Mega Pack 9")) {
      throw new Error("Generated source content was not materialized.");
    }

    const metrics = service.getMetrics();
    const verification = service.verify();

    console.log(
      JSON.stringify(
        {
          stage: "completed",
          generatedArtifacts: completed.artifacts.length,
          qualityScore: completed.qualityScore,
          runtimeReady: verification.healthy,
          humanFinalAuthority: verification.humanFinalAuthority,
          jobsCompleted: metrics.jobsCompleted,
          artifactsProduced: metrics.artifactsProduced,
          transactionCommitted: Boolean(completed.transactionId),
        },
        null,
        2,
      ),
    );
  } finally {
    await rm(targetRoot, { recursive: true, force: true });
  }
}

void main();
