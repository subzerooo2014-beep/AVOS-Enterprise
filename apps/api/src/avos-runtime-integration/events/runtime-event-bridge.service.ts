import { Injectable, Logger, OnModuleDestroy, Optional } from '@nestjs/common';
import { RuntimeEventBusService } from '../../avos-enterprise-runtime/events/runtime-event-bus.service';
import { RuntimePersistenceService } from '../persistence/runtime-persistence.service';

interface ExistingEventBusLike {
  publish?(event: unknown): unknown | Promise<unknown>;
  emit?(type: string, payload: unknown): unknown | Promise<unknown>;
  subscribe?(
    type: string,
    handler: (event: unknown) => void | Promise<void>,
  ): (() => void) | void;
}

@Injectable()
export class RuntimeEventBridgeService implements OnModuleDestroy {
  private readonly logger = new Logger(RuntimeEventBridgeService.name);
  private readonly disposers: Array<() => void> = [];
  private bridgedEvents = 0;

  constructor(
    private readonly runtimeBus: RuntimeEventBusService,
    private readonly persistence: RuntimePersistenceService,
    @Optional() private readonly enterpriseEventBus?: ExistingEventBusLike,
  ) {}

  connect(): {
    connected: boolean;
    mode: 'native' | 'adapter';
  } {
    const dispose = this.runtimeBus.subscribe('*', async (event) => {
      this.bridgedEvents += 1;

      await this.persistence.save(
        'events',
        event.type,
        event.id,
        event,
        'published',
      );

      if (this.enterpriseEventBus?.publish) {
        await this.enterpriseEventBus.publish(event);
      } else if (this.enterpriseEventBus?.emit) {
        await this.enterpriseEventBus.emit(event.type, event);
      }
    });

    this.disposers.push(dispose);

    const mode =
      this.enterpriseEventBus?.publish || this.enterpriseEventBus?.emit
        ? 'native'
        : 'adapter';

    this.logger.log(`Runtime event bridge connected in ${mode} mode`);

    return {
      connected: true,
      mode,
    };
  }

  publish(type: string, source: string, payload: unknown) {
    return this.runtimeBus.publish({
      type,
      source,
      payload,
    });
  }

  count(): number {
    return this.bridgedEvents;
  }

  mode(): 'native' | 'adapter' {
    return this.enterpriseEventBus?.publish ||
      this.enterpriseEventBus?.emit
      ? 'native'
      : 'adapter';
  }

  onModuleDestroy(): void {
    for (const dispose of this.disposers) {
      dispose();
    }
    this.disposers.length = 0;
  }
}