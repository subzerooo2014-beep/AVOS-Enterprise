import { Injectable } from "@nestjs/common";
import { BrainIntent } from "../enterprise-brain-mega-pack-1.types";
import { BrainSessionService } from "../sessions/brain-session.service";
import { BrainAuditService } from "../observability/brain-audit.service";

@Injectable()
export class BrainIntentService {
  private readonly intents =
    new Map<string, BrainIntent>();

  constructor(
    private readonly sessions: BrainSessionService,
    private readonly audit: BrainAuditService
  ) {}

  list() {
    return Array.from(this.intents.values());
  }

  get(id: string) {
    const intent = this.intents.get(id);

    if (!intent) {
      throw new Error(
        `Enterprise Brain intent not found: ${id}`
      );
    }

    return intent;
  }

  analyze(input: {
    sessionId: string;
    rawInput: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.sessions.get(input.sessionId);

    const normalizedInput =
      input.rawInput.trim().replace(/\s+/g, " ");

    const category =
      this.detectCategory(normalizedInput);

    const entities =
      this.detectEntities(normalizedInput);

    const constraints =
      this.detectConstraints(normalizedInput);

    const requiresClarification =
      normalizedInput.length < 8 ||
      category === "unknown";

    const intent: BrainIntent = {
      id: `brain-intent:${Date.now()}:${this.intents.size + 1}`,
      sessionId: input.sessionId,
      rawInput: input.rawInput,
      normalizedInput,
      category,
      confidence:
        category === "unknown"
          ? 45
          : 85,
      entities,
      constraints,
      requiresClarification,
      clarificationQuestions:
        requiresClarification
          ? ["What concrete outcome should the Enterprise Brain achieve?"]
          : [],
      createdAt: new Date().toISOString()
    };

    this.intents.set(intent.id, intent);

    this.sessions.attach(input.sessionId, {
      intentId: intent.id
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "intent",
      action: "enterprise-brain-intent-analyzed",
      subjectId: intent.id,
      actorIdentityId: input.actorIdentityId,
      outcome: requiresClarification
        ? "warning"
        : "success",
      metadata: {
        category: intent.category,
        confidence: intent.confidence
      }
    });

    return intent;
  }

  summary() {
    const intents = this.list();

    return {
      total: intents.length,
      requiringClarification:
        intents.filter((x) => x.requiresClarification).length,
      averageConfidence:
        intents.length === 0
          ? 0
          : Number(
              (
                intents.reduce(
                  (sum, item) =>
                    sum + item.confidence,
                  0
                ) / intents.length
              ).toFixed(2)
            )
    };
  }

  private detectCategory(
    input: string
  ): BrainIntent["category"] {
    const text = input.toLowerCase();

    if (
      text.includes("?") ||
      text.startsWith("what") ||
      text.startsWith("why") ||
      text.startsWith("how")
    ) return "question";

    if (
      text.includes("plan") ||
      text.includes("roadmap") ||
      text.includes("strategy")
    ) return "planning";

    if (
      text.includes("decide") ||
      text.includes("choose") ||
      text.includes("compare")
    ) return "decision";

    if (
      text.includes("analyze") ||
      text.includes("review") ||
      text.includes("assess")
    ) return "analysis";

    if (
      text.includes("execute") ||
      text.includes("run") ||
      text.includes("create")
    ) return "execution";

    if (
      text.includes("monitor") ||
      text.includes("watch") ||
      text.includes("track")
    ) return "monitoring";

    if (text.length > 8) return "command";

    return "unknown";
  }

  private detectEntities(input: string) {
    const entities: BrainIntent["entities"] = [];

    const quoted = input.match(/"([^"]+)"/g) ?? [];

    for (const item of quoted) {
      entities.push({
        name: "quoted-value",
        value: item.replace(/"/g, ""),
        confidence: 95
      });
    }

    return entities;
  }

  private detectConstraints(input: string) {
    const constraints: string[] = [];
    const text = input.toLowerCase();

    if (text.includes("must")) {
      constraints.push("mandatory");
    }

    if (text.includes("without")) {
      constraints.push("exclusion-present");
    }

    if (text.includes("before")) {
      constraints.push("ordering-present");
    }

    return constraints;
  }
}
