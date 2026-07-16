import { Injectable } from "@nestjs/common";
import { OperationalTwinRegistryService } from "./operational-twin-registry.service";
import { LiveStateSynchronizationService } from "./live-state-synchronization.service";
import type { TwinReplayRecord } from "./enterprise-digital-twin-operations.types";

@Injectable()
export class ScenarioReplayEngineService {
  private readonly replays: TwinReplayRecord[] = [];

  constructor(
    private readonly twins: OperationalTwinRegistryService,
    private readonly synchronization: LiveStateSynchronizationService,
  ) {}

  replay(
    twinId: string,
    fromVersion: number,
    toVersion: number,
  ): TwinReplayRecord {
    const twin = this.twins.get(twinId);
    const reconstructedState: Record<string, unknown> = {};

    const events = this.synchronization
      .list(twinId)
      .filter(
        (event) =>
          event.currentVersion >= fromVersion &&
          event.currentVersion <= toVersion,
      )
      .sort((left, right) => left.currentVersion - right.currentVersion);

    for (const event of events) {
      Object.assign(reconstructedState, event.patch);
    }

    if (events.length === 0 && toVersion === twin.version) {
      Object.assign(reconstructedState, twin.state);
    }

    const replay: TwinReplayRecord = {
      id: `twin-replay-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      twinId,
      fromVersion,
      toVersion,
      reconstructedState,
      createdAt: new Date().toISOString(),
    };

    this.replays.unshift(replay);
    return this.clone(replay);
  }

  list(): TwinReplayRecord[] {
    return this.replays.map((replay) => this.clone(replay));
  }

  count(): number {
    return this.replays.length;
  }

  private clone(replay: TwinReplayRecord): TwinReplayRecord {
    return {
      ...replay,
      reconstructedState: { ...replay.reconstructedState },
    };
  }
}
