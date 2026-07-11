import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenRuntimeEventHandler,
  CodeGenRuntimeEventV2,
} from "./codegen-runtime-event-v2.contracts";

export class CodeGenRuntimeEventBusV2 {
  private readonly handlers =
    new Map<
      string,
      Set<
        CodeGenRuntimeEventHandler
      >
    >();

  subscribe(
    eventType: string,
    handler:
      CodeGenRuntimeEventHandler,
  ): () => void {
    const current =
      this.handlers.get(
        eventType,
      ) ??
      new Set<
        CodeGenRuntimeEventHandler
      >();

    current.add(
      handler,
    );

    this.handlers.set(
      eventType,
      current,
    );

    return () => {
      current.delete(
        handler,
      );

      if (
        current.size === 0
      ) {
        this.handlers.delete(
          eventType,
        );
      }
    };
  }

  async publish<T>(
    input: {
      type: string;
      source: string;
      payload: T;
      metadata?:
        CodeGenMetadata;
    },
  ): Promise<
    CodeGenRuntimeEventV2<T>
  > {
    const event:
      CodeGenRuntimeEventV2<T> = {
      id:
        randomUUID(),
      type:
        input.type,
      source:
        input.source,
      payload:
        input.payload,
      metadata:
        structuredClone(
          input.metadata ?? {},
        ),
      createdAt:
        new Date().toISOString(),
    };

    const handlers = [
      ...(
        this.handlers.get(
          input.type,
        ) ??
        []
      ),
      ...(
        this.handlers.get(
          "*",
        ) ??
        []
      ),
    ];

    for (const handler of handlers) {
      await handler(
        event,
      );
    }

    return event;
  }

  clear(): void {
    this.handlers.clear();
  }
}
