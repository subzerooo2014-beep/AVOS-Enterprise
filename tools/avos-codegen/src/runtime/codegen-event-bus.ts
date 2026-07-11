import { randomUUID } from "node:crypto";
import {
  CodeGenEvent,
  CodeGenEventHandler,
  CodeGenEventSeverity,
  CodeGenEventType,
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../core/codegen.contracts";

export interface EmitCodeGenEventInput<
  TPayload extends CodeGenJsonValue =
    CodeGenJsonValue,
> {
  type: CodeGenEventType;
  severity?: CodeGenEventSeverity;
  source: string;
  executionId?: string;
  payload: TPayload;
  metadata?: CodeGenMetadata;
}

export class CodeGenEventBus {
  private readonly handlers =
    new Map<
      CodeGenEventType | "*",
      Set<CodeGenEventHandler>
    >();

  private readonly history:
    CodeGenEvent[] = [];

  private sequence =
    0;

  subscribe(
    type:
      CodeGenEventType | "*",
    handler:
      CodeGenEventHandler,
  ): () => void {
    const existing =
      this.handlers.get(type) ??
      new Set<CodeGenEventHandler>();

    existing.add(handler);

    this.handlers.set(
      type,
      existing,
    );

    return () => {
      existing.delete(handler);

      if (
        existing.size === 0
      ) {
        this.handlers.delete(type);
      }
    };
  }

  async emit<
    TPayload extends CodeGenJsonValue,
  >(
    input:
      EmitCodeGenEventInput<TPayload>,
  ): Promise<CodeGenEvent<TPayload>> {
    this.sequence +=
      1;

    const event:
      CodeGenEvent<TPayload> = {
      id:
        randomUUID(),
      sequence:
        this.sequence,
      type:
        input.type,
      severity:
        input.severity ??
        CodeGenEventSeverity.INFORMATIONAL,
      source:
        input.source,
      ...(input.executionId
        ? {
            executionId:
              input.executionId,
          }
        : {}),
      payload:
        input.payload,
      metadata:
        input.metadata ?? {},
      createdAt:
        new Date().toISOString(),
    };

    this.history.push(
      event,
    );

    const handlers = [
      ...(
        this.handlers.get(
          event.type,
        ) ?? []
      ),
      ...(
        this.handlers.get(
          "*",
        ) ?? []
      ),
    ];

    for (
      const handler of handlers
    ) {
      await handler(event);
    }

    return event;
  }

  list():
    readonly CodeGenEvent[] {
    return this.history.map(
      (event) =>
        structuredClone(event),
    );
  }

  clear(): void {
    this.history.splice(
      0,
      this.history.length,
    );

    this.sequence =
      0;
  }
}
