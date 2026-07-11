import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { PrismaService } from "../prisma/prisma.service";
import { PublisherRegistryService } from "./publisher-registry.service";
import { PublisherDispatcherService } from "./publisher-dispatcher.service";

@Controller("publisher-engine")
export class PublisherRuntimeController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: PublisherRegistryService,
    private readonly dispatcher: PublisherDispatcherService,
  ) {}

  @Get("channels")
  channels() {
    return {
      success: true,
      version: "v2",
      count: this.registry.count(),
      channels: this.registry.list(),
      registrations: this.registry.listMetadata(),
      generatedAt: new Date(),
    };
  }

  @Get("health")
  health() {
    return this.dispatcher.health();
  }

  @Post("publish")
  async publish(@Body() body: any) {
    const title = this.requiredText(
      body?.title,
      "title",
    );

    const requestedChannel = this.requiredText(
      body?.channel ??
        body?.result?.channel ??
        "internal",
      "channel",
    ).toLowerCase();

    const adapter = this.registry.get(
      requestedChannel,
    );

    const channel = adapter.channel;
    const correlationId =
      this.optionalText(body?.correlationId) ??
      randomUUID();

    const scheduledAt = body?.scheduledAt
      ? new Date(body.scheduledAt)
      : null;

    if (
      scheduledAt &&
      Number.isNaN(scheduledAt.getTime())
    ) {
      throw new Error(
        "scheduledAt must be a valid date",
      );
    }

    const inputResult =
      body?.result &&
      typeof body.result === "object" &&
      !Array.isArray(body.result)
        ? body.result
        : {};

    const result = {
      ...inputResult,
      channel,
      publisher: {
        ...(
          inputResult.publisher &&
          typeof inputResult.publisher === "object" &&
          !Array.isArray(inputResult.publisher)
            ? inputResult.publisher
            : {}
        ),
        channel,
      },
      metadata: {
        ...(
          inputResult.metadata &&
          typeof inputResult.metadata === "object" &&
          !Array.isArray(inputResult.metadata)
            ? inputResult.metadata
            : {}
        ),
        requestedChannel,
        createdBy:
          body?.createdBy ??
          "publisher-engine-api",
      },
    };

    const job = await (this.prisma as any).publishJob.create({
      data: {
        campaignId:
          this.optionalText(body?.campaignId),
        channelId:
          this.optionalText(body?.channelId),
        title,
        content:
          this.optionalText(body?.content),
        status: "queued",
        priority:
          this.normalizePriority(body?.priority),
        scheduledAt,
        retryCount: 0,
        maxRetries:
          this.normalizeMaxRetries(
            body?.maxRetries,
          ),
        correlationId,
        result,
      },
    });

    return {
      success: true,
      job,
      createdAt: new Date(),
    };
  }

  @Get("job/:id")
  async job(@Param("id") id: string) {
    const job = await (this.prisma as any).publishJob.findUnique({
      where: {
        id: this.requiredText(id, "id"),
      },
    });

    if (!job) {
      throw new Error(
        `Publisher job "${id}" was not found`,
      );
    }

    return {
      success: true,
      job,
    };
  }

  @Post("dispatch/:id")
  dispatchOne(@Param("id") id: string) {
    return this.dispatcher.dispatchOne(
      this.requiredText(id, "id"),
    );
  }

  @Post("dispatch-queued")
  dispatchQueued(
    @Query("limit") limit?: string,
  ) {
    return this.dispatcher.dispatchQueued(
      this.normalizeLimit(limit),
    );
  }

  private requiredText(
    value: unknown,
    field: string,
  ): string {
    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      throw new Error(
        `${field} must be a non-empty string`,
      );
    }

    return value.trim();
  }

  private optionalText(
    value: unknown,
  ): string | null {
    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      return null;
    }

    return value.trim();
  }

  private normalizePriority(
    value: unknown,
  ): string {
    const priority = String(
      value ?? "normal",
    )
      .trim()
      .toLowerCase();

    return [
      "low",
      "normal",
      "high",
      "critical",
    ].includes(priority)
      ? priority
      : "normal";
  }

  private normalizeMaxRetries(
    value: unknown,
  ): number {
    const numeric = Number(value);

    if (
      !Number.isInteger(numeric) ||
      numeric < 0
    ) {
      return 3;
    }

    return Math.min(numeric, 20);
  }

  private normalizeLimit(
    value: unknown,
  ): number {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
      return 20;
    }

    return Math.min(
      Math.max(Math.trunc(numeric), 1),
      200,
    );
  }
}
