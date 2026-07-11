import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { randomBytes } from "node:crypto";

import {
  ConnectorSecurityChannel,
} from "./connector-credential-vault.service";

interface OAuthStateRecord {
  state: string;
  channel: ConnectorSecurityChannel;
  redirectUri: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

@Injectable()
export class ConnectorOAuthStateService {
  private readonly states =
    new Map<string, OAuthStateRecord>();

  private readonly ttlMs =
    this.positiveInteger(
      process.env.CONNECTOR_OAUTH_STATE_TTL_MS,
      10 * 60 * 1000,
    );

  create(input: {
    channel: ConnectorSecurityChannel;
    redirectUri: string;
  }) {
    this.cleanup();

    const state =
      randomBytes(32)
        .toString("hex");

    const now = Date.now();

    const record: OAuthStateRecord = {
      state,
      channel: input.channel,
      redirectUri:
        input.redirectUri,
      createdAt: now,
      expiresAt:
        now + this.ttlMs,
      used: false,
    };

    this.states.set(
      state,
      record,
    );

    return {
      state,
      channel:
        record.channel,
      redirectUri:
        record.redirectUri,
      expiresAt:
        new Date(
          record.expiresAt,
        ),
    };
  }

  consume(
    state: string,
    channel: ConnectorSecurityChannel,
  ) {
    this.cleanup();

    const record =
      this.states.get(state);

    if (!record) {
      throw new BadRequestException(
        "OAuth state is invalid or expired.",
      );
    }

    if (record.used) {
      throw new BadRequestException(
        "OAuth state has already been used.",
      );
    }

    if (
      record.channel !== channel
    ) {
      throw new BadRequestException(
        "OAuth state channel mismatch.",
      );
    }

    record.used = true;

    this.states.delete(state);

    return {
      valid: true,
      channel:
        record.channel,
      redirectUri:
        record.redirectUri,
      createdAt:
        new Date(
          record.createdAt,
        ),
    };
  }

  status() {
    this.cleanup();

    return {
      activeStates:
        this.states.size,
      ttlMs:
        this.ttlMs,
    };
  }

  private cleanup(): void {
    const now = Date.now();

    for (
      const [key, record]
      of this.states
    ) {
      if (
        record.used ||
        record.expiresAt <= now
      ) {
        this.states.delete(key);
      }
    }
  }

  private positiveInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    const numeric =
      Number(value);

    return Number.isInteger(numeric) &&
      numeric > 0
      ? numeric
      : fallback;
  }
}

