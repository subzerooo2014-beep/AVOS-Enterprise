import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CodeGenerationBlueprint,
  CodeGenerationSession,
} from "../types/code-generation-os.types";
import { CodeArtifactFactoryService } from "./code-artifact-factory.service";
import { CodeArtifactRegistry } from "../registry/code-artifact.registry";
import { CodeGenerationSessionRegistry } from "../registry/code-generation-session.registry";
import { CodeQualityEngineService } from "../quality/code-quality-engine.service";

@Injectable()
export class CodeGenerationPipelineService {
  constructor(
    private readonly factory: CodeArtifactFactoryService,
    private readonly artifacts: CodeArtifactRegistry,
    private readonly sessions: CodeGenerationSessionRegistry,
    private readonly quality: CodeQualityEngineService,
  ) {}

  createSession(blueprint: CodeGenerationBlueprint): CodeGenerationSession {
    const now = new Date().toISOString();
    return this.sessions.save({
      id: `codegen-session:${randomUUID()}`,
      blueprintId: blueprint.id,
      stage: "awaiting-human-approval",
      artifacts: [],
      events: ["session-created", "blueprint-compiled", "awaiting-human-approval"],
      createdAt: now,
      updatedAt: now,
    });
  }

  execute(sessionId: string, blueprint: CodeGenerationBlueprint) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Generation session not found: ${sessionId}`);
    if (session.stage !== "approved") {
      throw new Error("Human approval is required before code generation.");
    }

    const generated = blueprint.artifacts.map((request) => this.factory.create(request));
    const assessment = this.quality.assess(blueprint.artifacts, generated);
    if (!assessment.passed) {
      session.stage = "failed";
      session.events.push("quality-failed");
      this.sessions.save(session);
      return { session, assessment };
    }

    for (const artifact of generated) this.artifacts.register(artifact);
    session.artifacts = generated;
    session.stage = "generated";
    session.events.push("generation-completed");
    this.sessions.save(session);
    return { session, assessment };
  }
}
