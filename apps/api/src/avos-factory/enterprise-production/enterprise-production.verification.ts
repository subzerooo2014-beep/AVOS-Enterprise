import { EnterpriseProductionService } from "./enterprise-production.service";

async function main() {
  const service = new EnterpriseProductionService();
  const verification = service.verify();

  const expectedCapabilities = [
    "enterprise-production-pipeline",
    "code-materialization-engine",
    "generation-transaction-manager",
    "rollback-engine",
    "artifact-registry",
    "quality-gates",
    "codegen-os-contract",
    "genesis-engine-contract",
    "capability-registry-contract",
  ];

  const missing = expectedCapabilities.filter(
    (capability) => !verification.capabilities.includes(capability),
  );

  if (!verification.healthy) {
    throw new Error("Enterprise production engine is not healthy.");
  }

  if (!verification.humanFinalAuthority) {
    throw new Error("Human Final Authority must remain enabled.");
  }

  if (missing.length > 0) {
    throw new Error(`Missing capabilities: ${missing.join(", ")}`);
  }

  console.log(
    JSON.stringify(
      {
        stage: "verified",
        classification: verification.classification,
        version: verification.version,
        healthy: verification.healthy,
        humanFinalAuthority: verification.humanFinalAuthority,
        capabilities: verification.capabilities.length,
        registeredArtifacts: verification.registeredArtifacts,
      },
      null,
      2,
    ),
  );
}

void main();
