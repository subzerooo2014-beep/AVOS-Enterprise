import { randomUUID } from "node:crypto";
import {
  DigitalTwinDiff,
  DigitalTwinEntity,
  DigitalTwinSnapshot,
} from "./contracts";

export class EnterpriseDigitalTwinEngine {
  createSnapshot(
    systemKey: string,
    version: string,
    entities: readonly DigitalTwinEntity[],
  ): DigitalTwinSnapshot {
    return {
      id: randomUUID(),
      systemKey,
      version,
      entities: entities.map((item) => structuredClone(item)),
      createdAt: new Date().toISOString(),
    };
  }

  diff(
    baseline: DigitalTwinSnapshot,
    candidate: DigitalTwinSnapshot,
  ): DigitalTwinDiff {
    const baselineByKey =
      new Map(
        baseline.entities.map((item) => [item.key, item]),
      );

    const candidateByKey =
      new Map(
        candidate.entities.map((item) => [item.key, item]),
      );

    const added =
      candidate.entities
        .filter((item) => !baselineByKey.has(item.key))
        .map((item) => item.key);

    const removed =
      baseline.entities
        .filter((item) => !candidateByKey.has(item.key))
        .map((item) => item.key);

    const changed =
      candidate.entities
        .filter((item) => {
          const previous = baselineByKey.get(item.key);
          return Boolean(
            previous &&
            JSON.stringify(previous.state) !==
              JSON.stringify(item.state),
          );
        })
        .map((item) => item.key);

    return {
      added,
      removed,
      changed,
      generatedAt: new Date().toISOString(),
    };
  }
}
