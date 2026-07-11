import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  randomUUID,
} from "node:crypto";

import { PrismaService } from "../prisma/prisma.service";
import { PublisherDispatcherService } from "../publisher-engine/publisher-dispatcher.service";
import { PublisherRegistryService } from "../publisher-engine/publisher-registry.service";

export interface CampaignLaunchOptions {
  launchedBy?: string;
  dispatchImmediately?: boolean;
  channels?: string[];
}

export interface CampaignChannelPlan {
  channel: string;
  mode?: string;
  budget?: number;
  dailyBudget?: number;
  priority?: string;
  objective?: string;
  expectedAction?: string;
}

@Injectable()
export class AiCampaignLaunchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dispatcher: PublisherDispatcherService,
    private readonly registry: PublisherRegistryService,
  ) {}

  async validate(
    eventId: string,
    requestedChannels?: string[],
  ) {
    const event =
      await this.campaignEvent(
        eventId,
      );

    const payload =
      this.objectOf(
        event.payload,
      );

    const plan =
      this.objectOf(
        payload.plan,
      );

    const vehicleId =
      this.requiredText(
        plan.vehicleId ??
        event.entityId,
        "vehicleId",
      );

    const selectedChannels =
      this.selectedChannels(
        plan,
        requestedChannels,
      );

    const unsupportedChannels =
      selectedChannels.filter(
        (channel) =>
          !this.registry.exists(
            channel,
          ),
      );

    const channelPlans =
      this.channelPlans(
        plan,
        selectedChannels,
      );

    const vehicle =
      await (this.prisma as any).vehicle.findUnique({
        where: {
          id:
            vehicleId,
        },

        include: {
          inventory: true,
        },
      });

    const errors: string[] = [];
    const warnings: string[] = [];

    if (
      event.status !==
      "approved"
    ) {
      errors.push(
        `Campaign must be approved before launch. Current status: ${event.status}.`,
      );
    }

    if (!vehicle) {
      errors.push(
        "Campaign vehicle was not found.",
      );
    }

    if (
      selectedChannels.length ===
      0
    ) {
      errors.push(
        "Campaign does not contain launchable channels.",
      );
    }

    if (
      unsupportedChannels.length >
      0
    ) {
      errors.push(
        `Unsupported publisher channels: ${unsupportedChannels.join(", ")}.`,
      );
    }

    if (
      !plan.creativeBrief
    ) {
      warnings.push(
        "Campaign does not contain a creative brief.",
      );
    }

    if (
      Number(
        plan.totalBudget ??
        0,
      ) > 0 &&
      !vehicle?.inventory?.price
    ) {
      warnings.push(
        "Paid campaign is enabled while the vehicle has no inventory price.",
      );
    }

    return {
      success:
        errors.length === 0,

      valid:
        errors.length === 0,

      eventId:
        event.id,

      campaignStatus:
        event.status,

      vehicleId,

      selectedChannels,

      channelPlans,

      unsupportedChannels,

      errors,
      warnings,

      checkedAt:
        new Date(),
    };
  }

  async launch(
    eventId: string,
    options: CampaignLaunchOptions = {},
  ) {
    const event =
      await this.campaignEvent(
        eventId,
      );

    if (
      event.status !==
      "approved"
    ) {
      throw new ConflictException(
        `Campaign cannot be launched from status "${event.status}".`,
      );
    }

    const validation =
      await this.validate(
        eventId,
        options.channels,
      );

    if (!validation.valid) {
      throw new BadRequestException({
        message:
          "Campaign launch validation failed.",
        errors:
          validation.errors,
        warnings:
          validation.warnings,
      });
    }

    const payload =
      this.objectOf(
        event.payload,
      );

    const plan =
      this.objectOf(
        payload.plan,
      );

    const launchId =
      randomUUID();

    const correlationId =
      randomUUID();

    const startedAt =
      new Date();

    const dispatchImmediately =
      options.dispatchImmediately !==
      false;

    await this.recordLifecycle(
      event,
      {
        action:
          "AI_CAMPAIGN_LAUNCH_STARTED",

        fromStatus:
          event.status,

        toStatus:
          "launching",

        actor:
          options.launchedBy ??
          "system",

        details: {
          launchId,
          correlationId,
          channels:
            validation.selectedChannels,
          dispatchImmediately,
        },
      },
      "launching",
    );

    const jobs: any[] = [];

    for (
      const channelPlan
      of validation.channelPlans
    ) {
      const job =
        await this.createPublishJob({
          campaignEvent:
            event,

          plan,

          channelPlan,

          launchId,

          correlationId,
        });

      jobs.push({
        channel:
          channelPlan.channel,

        jobId:
          job.id,

        status:
          job.status,

        createdAt:
          job.createdAt,
      });
    }

    const dispatches: any[] = [];

    if (dispatchImmediately) {
      for (const job of jobs) {
        try {
          const result =
            await this.dispatcher.dispatchOne(
              job.jobId,
            );

          dispatches.push({
            channel:
              job.channel,

            jobId:
              job.jobId,

            success:
              this.dispatchSuccess(
                result,
              ),

            status:
              this.dispatchStatus(
                result,
              ),

            result,
          });
        } catch (error) {
          dispatches.push({
            channel:
              job.channel,

            jobId:
              job.jobId,

            success: false,

            status:
              "failed",

            error:
              this.errorMessage(
                error,
              ),
          });
        }
      }
    }

    const successful =
      dispatchImmediately
        ? dispatches.filter(
            (item) =>
              item.success,
          ).length
        : 0;

    const failed =
      dispatchImmediately
        ? dispatches.length -
          successful
        : 0;

    const finalStatus =
      !dispatchImmediately
        ? "queued"
        : failed === 0
          ? "launched"
          : successful > 0
            ? "partial_failure"
            : "launch_failed";

    const completedAt =
      new Date();

    const launchRecord = {
      launchId,
      correlationId,

      launchedBy:
        options.launchedBy ??
        "system",

      dispatchImmediately,

      channels:
        validation.selectedChannels,

      totalJobs:
        jobs.length,

      successful,
      failed,

      status:
        finalStatus,

      jobs,

      dispatches:
        dispatches.map(
          (item) => ({
            channel:
              item.channel,

            jobId:
              item.jobId,

            success:
              item.success,

            status:
              item.status,

            error:
              item.error ??
              null,
          }),
        ),

      startedAt:
        startedAt.toISOString(),

      completedAt:
        completedAt.toISOString(),

      durationMs:
        Math.max(
          0,
          completedAt.getTime() -
          startedAt.getTime(),
        ),
    };

    const currentEvent =
      await this.campaignEvent(
        eventId,
      );

    const currentResult =
      this.objectOf(
        currentEvent.result,
      );

    const launches =
      Array.isArray(
        currentResult.launches,
      )
        ? currentResult.launches
        : [];

    const lifecycle =
      Array.isArray(
        currentResult.lifecycle,
      )
        ? currentResult.lifecycle
        : [];

    const lifecycleRecord = {
      id:
        randomUUID(),

      action:
        "AI_CAMPAIGN_LAUNCH_COMPLETED",

      fromStatus:
        "launching",

      toStatus:
        finalStatus,

      actor:
        options.launchedBy ??
        "system",

      at:
        completedAt.toISOString(),

      details: {
        launchId,
        totalJobs:
          jobs.length,
        successful,
        failed,
      },
    };

    const updated =
      await (this.prisma as any).platformEvent.update({
        where: {
          id:
            eventId,
        },

        data: {
          status:
            finalStatus,

          result: {
            ...currentResult,

            launches: [
              ...launches,
              launchRecord,
            ],

            latestLaunch:
              launchRecord,

            lifecycle: [
              ...lifecycle,
              lifecycleRecord,
            ],

            latestDecision:
              lifecycleRecord,
          },

          updatedAt:
            completedAt,
        },
      });

    await this.audit(
      finalStatus ===
        "launched"
        ? "AI_CAMPAIGN_LAUNCHED"
        : finalStatus ===
            "partial_failure"
          ? "AI_CAMPAIGN_PARTIALLY_LAUNCHED"
          : finalStatus ===
              "queued"
            ? "AI_CAMPAIGN_QUEUED"
            : "AI_CAMPAIGN_LAUNCH_FAILED",

      eventId,
    );

    return {
      success:
        finalStatus ===
          "launched" ||
        finalStatus ===
          "queued",

      partialSuccess:
        finalStatus ===
        "partial_failure",

      eventId:
        updated.id,

      launch:
        launchRecord,

      campaignStatus:
        updated.status,
    };
  }

  async retryFailed(
    eventId: string,
    launchedBy = "system",
  ) {
    const event =
      await this.campaignEvent(
        eventId,
      );

    const result =
      this.objectOf(
        event.result,
      );

    const latestLaunch =
      this.objectOf(
        result.latestLaunch,
      );

    const dispatches =
      Array.isArray(
        latestLaunch.dispatches,
      )
        ? latestLaunch.dispatches
        : [];

    const failedJobs =
      dispatches.filter(
        (item: any) =>
          item?.success !== true &&
          typeof item?.jobId ===
            "string",
      );

    if (
      failedJobs.length ===
      0
    ) {
      return {
        success: true,
        eventId,
        retried: 0,
        message:
          "No failed campaign jobs require retry.",
      };
    }

    const retries: any[] = [];

    for (
      const failedJob
      of failedJobs
    ) {
      try {
        await (this.prisma as any).publishJob.update({
          where: {
            id:
              failedJob.jobId,
          },

          data: {
            status:
              "queued",

            lastError:
              null,

            failedAt:
              null,

            updatedAt:
              new Date(),
          },
        });

        const dispatch =
          await this.dispatcher.dispatchOne(
            failedJob.jobId,
          );

        retries.push({
          jobId:
            failedJob.jobId,

          channel:
            failedJob.channel,

          success:
            this.dispatchSuccess(
              dispatch,
            ),

          status:
            this.dispatchStatus(
              dispatch,
            ),

          dispatch,
        });
      } catch (error) {
        retries.push({
          jobId:
            failedJob.jobId,

          channel:
            failedJob.channel,

          success: false,

          status:
            "failed",

          error:
            this.errorMessage(
              error,
            ),
        });
      }
    }

    const succeeded =
      retries.filter(
        (item) =>
          item.success,
      ).length;

    const stillFailed =
      retries.length -
      succeeded;

    const nextStatus =
      stillFailed === 0
        ? "launched"
        : succeeded > 0
          ? "partial_failure"
          : "launch_failed";

    await this.recordLifecycle(
      event,
      {
        action:
          "AI_CAMPAIGN_FAILED_JOBS_RETRIED",

        fromStatus:
          event.status,

        toStatus:
          nextStatus,

        actor:
          launchedBy,

        details: {
          attempted:
            retries.length,
          succeeded,
          failed:
            stillFailed,
        },
      },
      nextStatus,
    );

    await this.audit(
      "AI_CAMPAIGN_FAILED_JOBS_RETRIED",
      eventId,
    );

    return {
      success:
        stillFailed === 0,

      partialSuccess:
        succeeded > 0 &&
        stillFailed > 0,

      eventId,

      status:
        nextStatus,

      attempted:
        retries.length,

      succeeded,
      failed:
        stillFailed,

      retries,
    };
  }

  async launchSummary(
    eventId: string,
  ) {
    const event =
      await this.campaignEvent(
        eventId,
      );

    const result =
      this.objectOf(
        event.result,
      );

    const launches =
      Array.isArray(
        result.launches,
      )
        ? result.launches
        : [];

    return {
      success: true,

      eventId:
        event.id,

      campaignStatus:
        event.status,

      launchCount:
        launches.length,

      latestLaunch:
        result.latestLaunch ??
        null,

      launches,
    };
  }

  async progress(
    eventId: string,
  ) {
    const event =
      await this.campaignEvent(
        eventId,
      );

    const result =
      this.objectOf(
        event.result,
      );

    const latestLaunch =
      this.objectOf(
        result.latestLaunch,
      );

    const jobs =
      Array.isArray(
        latestLaunch.jobs,
      )
        ? latestLaunch.jobs
        : [];

    const currentJobs: any[] = [];

    for (const job of jobs) {
      const stored =
        await (this.prisma as any).publishJob.findUnique({
          where: {
            id:
              job.jobId,
          },
        });

      currentJobs.push({
        channel:
          job.channel,

        jobId:
          job.jobId,

        status:
          stored?.status ??
          "not_found",

        retryCount:
          stored?.retryCount ??
          null,

        maxRetries:
          stored?.maxRetries ??
          null,

        externalResult:
          stored?.result ??
          null,

        lastError:
          stored?.lastError ??
          null,

        updatedAt:
          stored?.updatedAt ??
          null,
      });
    }

    const completed =
      currentJobs.filter(
        (item) =>
          [
            "published",
            "delivered",
          ].includes(
            item.status,
          ),
      ).length;

    const failed =
      currentJobs.filter(
        (item) =>
          [
            "failed",
            "dead",
          ].includes(
            item.status,
          ),
      ).length;

    const pending =
      currentJobs.length -
      completed -
      failed;

    return {
      success: true,

      eventId,

      campaignStatus:
        event.status,

      launchId:
        latestLaunch.launchId ??
        null,

      totals: {
        jobs:
          currentJobs.length,
        completed,
        failed,
        pending,
      },

      progressPercent:
        currentJobs.length > 0
          ? Number(
              (
                completed /
                currentJobs.length *
                100
              ).toFixed(2),
            )
          : 0,

      jobs:
        currentJobs,

      checkedAt:
        new Date(),
    };
  }

  private async createPublishJob(
    input: {
      campaignEvent: any;
      plan: Record<string, any>;
      channelPlan: CampaignChannelPlan;
      launchId: string;
      correlationId: string;
    },
  ) {
    const vehicleSnapshot =
      this.objectOf(
        input.plan.vehicleSnapshot,
      );

    const creativeBrief =
      this.objectOf(
        input.plan.creativeBrief,
      );

    const channel =
      input.channelPlan.channel;

    const title =
      this.requiredText(
        creativeBrief.headline ??
        `${vehicleSnapshot.year ?? ""} ${vehicleSnapshot.make ?? ""} ${vehicleSnapshot.model ?? ""}`.trim(),
        "campaign title",
      );

    const content =
      this.creativeContent({
        creativeBrief,
        vehicleSnapshot,
        channel,
      });

    const now =
      new Date();

    return (this.prisma as any).publishJob.create({
      data: {
        title,
        content,

        status:
          "queued",

        priority:
          input.channelPlan.priority ??
          "normal",

        scheduledAt:
          null,

        retryCount:
          0,

        maxRetries:
          3,

        lastError:
          null,

        correlationId:
          `${input.correlationId}:${channel}`,

        result: {
          vehicleId:
            input.plan.vehicleId ??
            input.campaignEvent.entityId,

          channel,

          campaignPlanId:
            input.plan.planId ??
            null,

          campaignEventId:
            input.campaignEvent.id,

          launchId:
            input.launchId,

          objective:
            input.channelPlan.objective ??
            input.plan.objective ??
            "vehicle_leads",

          budget:
            input.channelPlan.budget ??
            0,

          dailyBudget:
            input.channelPlan.dailyBudget ??
            0,

          mode:
            input.channelPlan.mode ??
            "organic",

          audience:
            input.plan.audience ??
            null,

          schedule:
            this.scheduleForChannel(
              input.plan,
              channel,
            ),

          creative: {
            title,
            content,

            price:
              vehicleSnapshot.price ??
              null,

            callToAction:
              creativeBrief.callToAction ??
              null,

            language:
              input.plan.language ??
              "en",
          },

          metadata: {
            source:
              "ai-campaign-launch-engine",

            createdBy:
              "ai-campaign-manager",

            launchId:
              input.launchId,

            campaignEventId:
              input.campaignEvent.id,
          },

          publisher: {
            channel,
          },
        },

        updatedAt:
          now,
      },
    });
  }

  private async campaignEvent(
    eventId: string,
  ) {
    const normalized =
      String(eventId)
        .trim();

    if (!normalized) {
      throw new BadRequestException(
        "eventId is required.",
      );
    }

    const event =
      await (this.prisma as any).platformEvent.findUnique({
        where: {
          id:
            normalized,
        },
      });

    if (!event) {
      throw new NotFoundException(
        "AI campaign plan was not found.",
      );
    }

    if (
      event.type !==
      "AiCampaignPlanGenerated"
    ) {
      throw new BadRequestException(
        "PlatformEvent is not an AI campaign plan.",
      );
    }

    return event;
  }

  private selectedChannels(
    plan: Record<string, any>,
    requestedChannels?: string[],
  ): string[] {
    const planned =
      Array.isArray(
        plan.selectedChannels,
      )
        ? plan.selectedChannels
        : [];

    const requested =
      Array.isArray(
        requestedChannels,
      ) &&
      requestedChannels.length > 0
        ? requestedChannels
        : planned;

    return Array.from(
      new Set(
        requested
          .map(
            (channel) =>
              String(channel)
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      ),
    );
  }

  private channelPlans(
    plan: Record<string, any>,
    selectedChannels: string[],
  ): CampaignChannelPlan[] {
    const planned =
      Array.isArray(
        plan.channelPlans,
      )
        ? plan.channelPlans
        : [];

    return selectedChannels.map(
      (channel) => {
        const existing =
          planned.find(
            (item: any) =>
              String(
                item?.channel ??
                "",
              )
                .trim()
                .toLowerCase() ===
              channel,
          );

        return {
          channel,

          mode:
            existing?.mode ??
            "organic",

          budget:
            Number(
              existing?.budget ??
              0,
            ),

          dailyBudget:
            Number(
              existing?.dailyBudget ??
              0,
            ),

          priority:
            existing?.priority ??
            "normal",

          objective:
            existing?.objective ??
            plan.objective ??
            "vehicle_leads",

          expectedAction:
            existing?.expectedAction ??
            "publish",
        };
      },
    );
  }

  private creativeContent(
    input: {
      creativeBrief: Record<string, any>;
      vehicleSnapshot: Record<string, any>;
      channel: string;
    },
  ): string {
    const messages =
      Array.isArray(
        input.creativeBrief.keyMessages,
      )
        ? input.creativeBrief.keyMessages
        : [];

    return [
      input.creativeBrief.headline,
      ...messages,
      input.creativeBrief.callToAction,
      `Channel: ${input.channel}`,
    ]
      .filter(
        (item) =>
          typeof item ===
            "string" &&
          item.trim(),
      )
      .join(
        "`n`n",
      );
  }

  private scheduleForChannel(
    plan: Record<string, any>,
    channel: string,
  ) {
    const schedules =
      Array.isArray(
        plan.schedule,
      )
        ? plan.schedule
        : [];

    return schedules.find(
      (item: any) =>
        String(
          item?.channel ??
          "",
        )
          .trim()
          .toLowerCase() ===
        channel,
    ) ?? null;
  }

  private async recordLifecycle(
    event: any,
    input: {
      action: string;
      fromStatus: string;
      toStatus: string;
      actor: string;
      details?: any;
    },
    status: string,
  ) {
    const current =
      await (this.prisma as any).platformEvent.findUnique({
        where: {
          id:
            event.id,
        },
      });

    if (!current) {
      throw new NotFoundException(
        "AI campaign plan was not found.",
      );
    }

    const result =
      this.objectOf(
        current.result,
      );

    const lifecycle =
      Array.isArray(
        result.lifecycle,
      )
        ? result.lifecycle
        : [];

    const record = {
      id:
        randomUUID(),

      action:
        input.action,

      fromStatus:
        input.fromStatus,

      toStatus:
        input.toStatus,

      actor:
        input.actor,

      details:
        input.details ??
        {},

      at:
        new Date()
          .toISOString(),
    };

    return (this.prisma as any).platformEvent.update({
      where: {
        id:
          event.id,
      },

      data: {
        status,

        result: {
          ...result,

          lifecycle: [
            ...lifecycle,
            record,
          ],

          latestDecision:
            record,
        },

        updatedAt:
          new Date(),
      },
    });
  }

  private dispatchSuccess(
    result: any,
  ): boolean {
    const status =
      this.dispatchStatus(
        result,
      );

    return (
      result?.success === true ||
      [
        "published",
        "delivered",
      ].includes(status)
    );
  }

  private dispatchStatus(
    result: any,
  ): string {
    const value =
      result?.status ??
      result?.job?.status ??
      result?.result?.status ??
      "unknown";

    return String(value)
      .trim()
      .toLowerCase();
  }

  private requiredText(
    value: unknown,
    field: string,
  ): string {
    if (
      typeof value !==
        "string" ||
      !value.trim()
    ) {
      throw new BadRequestException(
        `${field} is required.`,
      );
    }

    return value.trim();
  }

  private objectOf(
    value: any,
  ): Record<string, any> {
    if (
      value &&
      typeof value ===
        "object" &&
      !Array.isArray(value)
    ) {
      return value;
    }

    return {};
  }

  private errorMessage(
    error: unknown,
  ): string {
    return error instanceof Error
      ? error.message
      : String(
          error ??
          "Unknown campaign launch error.",
        );
  }

  private async audit(
    action: string,
    entityId: string,
  ) {
    await this.prisma.auditLog.create({
      data: {
        action,
        entity:
          "PlatformEvent",
        entityId,
      },
    });
  }
}

