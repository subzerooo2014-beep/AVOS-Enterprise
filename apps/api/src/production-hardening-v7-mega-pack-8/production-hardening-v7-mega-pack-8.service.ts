import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import {
  createHash,
  randomUUID,
} from "node:crypto";
import {
  ActivateKillSwitchDto,
  ApproveConfigurationDto,
  CreateBaselineDto,
  CreateConfigurationDto,
  CreateFeatureFlagDto,
  CreateKillSwitchDto,
  CreatePolicyDto,
  ReleaseKillSwitchDto,
  RollbackConfigurationDto,
  UpdateFeatureFlagDto,
} from "./production-hardening-v7-mega-pack-8.dto";
import { ProductionHardeningV7MegaPack8Store } from "./production-hardening-v7-mega-pack-8.store";
import {
  ConfigurationBaseline,
  ConfigurationEntry,
  ConfigurationGovernanceStatus,
  ConfigurationPolicy,
  ConfigurationValue,
  FeatureFlag,
  KillSwitch,
  PolicyEvaluation,
} from "./production-hardening-v7-mega-pack-8.types";

@Injectable()
export class ProductionHardeningV7MegaPack8Service
  implements OnModuleInit
{
  constructor(
    private readonly store:
      ProductionHardeningV7MegaPack8Store,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.store.waitUntilReady();
    await this.bootstrapDefaults();
  }

  getStatus():
    ConfigurationGovernanceStatus {
    const state = this.store.getSnapshot();
    const evidence =
      this.store.verifyEvidenceChain();

    const criticalDrifts =
      state.drifts.filter(
        (item) =>
          item.status === "critical_drift",
      ).length;

    const blockedEvaluations =
      state.evaluations.filter(
        (item) => item.result === "blocked",
      ).length;

    const activatedKillSwitches =
      state.killSwitches.filter(
        (item) =>
          item.status === "activated",
      ).length;

    const healthStatus =
      !evidence.verified ||
      activatedKillSwitches > 0
        ? "critical"
        : criticalDrifts > 0 ||
            blockedEvaluations > 0
          ? "degraded"
          : "healthy";

    return {
      success: true,
      system:
        "AVOS Production Hardening V7 — Mega Pack 8",
      version: "v7-mega-pack-8",
      healthStatus,
      evidenceChainVerified:
        evidence.verified,

      configurations:
        state.configurations.length,
      activeConfigurations:
        state.configurations.filter(
          (item) => item.status === "active",
        ).length,
      pendingApprovals:
        state.configurations.filter(
          (item) =>
            item.status ===
            "pending_approval",
        ).length,
      rejectedConfigurations:
        state.configurations.filter(
          (item) =>
            item.status === "rejected",
        ).length,
      rolledBackConfigurations:
        state.configurations.filter(
          (item) =>
            item.status === "rolled_back",
        ).length,

      policies: state.policies.length,
      activePolicies:
        state.policies.filter(
          (item) => item.active,
        ).length,
      policyEvaluations:
        state.evaluations.length,
      blockedEvaluations,

      baselines: state.baselines.length,
      activeBaselines:
        state.baselines.filter(
          (item) => item.active,
        ).length,
      driftScans: state.drifts.length,
      criticalDrifts,

      featureFlags:
        state.featureFlags.length,
      enabledFeatureFlags:
        state.featureFlags.filter(
          (item) => item.enabled,
        ).length,

      killSwitches:
        state.killSwitches.length,
      activatedKillSwitches,

      approvals: state.approvals.length,
      rollbacks: state.rollbacks.length,
      evidenceEntries:
        state.evidence.length,
      platformEvents:
        state.events.length,

      updatedAt: state.updatedAt,
    };
  }

  getSnapshot() {
    return {
      ...this.store.getSnapshot(),
      evidenceVerification:
        this.store.verifyEvidenceChain(),
    };
  }

  listConfigurations() {
    return this.store
      .getSnapshot()
      .configurations
      .sort((left, right) =>
        right.createdAt.localeCompare(
          left.createdAt,
        ),
      );
  }

  async createConfiguration(
    dto: CreateConfigurationDto,
  ) {
    const state = this.store.getSnapshot();

    const latest = state.configurations
      .filter(
        (item) =>
          item.key === dto.key &&
          item.service === dto.service &&
          item.environment ===
            dto.environment,
      )
      .sort(
        (left, right) =>
          right.version - left.version,
      )[0];

    const now = new Date().toISOString();

    const configuration:
      ConfigurationEntry = {
      id: randomUUID(),
      key: dto.key.trim(),
      service: dto.service.trim(),
      environment: dto.environment,
      value: dto.value,
      previousValue:
        latest?.value ?? null,
      version:
        (latest?.version ?? 0) + 1,
      status: "pending_approval",
      sensitive: dto.sensitive ?? false,
      description:
        dto.description?.trim() ?? null,
      requestedBy:
        dto.requestedBy.trim(),
      approvedBy: null,
      approvalReason: null,
      createdAt: now,
      updatedAt: now,
      activatedAt: null,
    };

    const evaluation =
      this.evaluateConfigurationRules(
        configuration,
        state.policies,
        latest ?? null,
      );

    await this.store.mutate(
      (mutableState) => {
        mutableState.configurations.push(
          configuration,
        );

        mutableState.evaluations.push(
          evaluation,
        );
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.change.requested",
      entityType: "configuration",
      entityId: configuration.id,
      severity:
        evaluation.result === "blocked"
          ? "critical"
          : evaluation.result === "warning"
            ? "warning"
            : "info",
      message:
        `Configuration ${configuration.key} requested`,
      payload: {
        configuration,
        evaluation,
      },
    });

    return {
      configuration,
      evaluation,
    };
  }

  async approveConfiguration(
    configurationId: string,
    dto: ApproveConfigurationDto,
  ) {
    const state = this.store.getSnapshot();

    const existing =
      state.configurations.find(
        (item) =>
          item.id === configurationId,
      );

    if (!existing) {
      throw new NotFoundException(
        `Configuration not found: ${configurationId}`,
      );
    }

    if (
      existing.status !==
      "pending_approval"
    ) {
      throw new ConflictException(
        `Configuration cannot be approved from status ${existing.status}`,
      );
    }

    const evaluation =
      state.evaluations
        .filter(
          (item) =>
            item.configurationId ===
            configurationId,
        )
        .sort((left, right) =>
          right.evaluatedAt.localeCompare(
            left.evaluatedAt,
          ),
        )[0];

    if (
      dto.decision === "approved" &&
      evaluation?.result === "blocked"
    ) {
      throw new ConflictException(
        "Configuration is blocked by policy enforcement",
      );
    }

    const now = new Date().toISOString();

    const updated: ConfigurationEntry = {
      ...existing,
      status:
        dto.decision === "approved"
          ? "active"
          : "rejected",
      approvedBy: dto.approver.trim(),
      approvalReason: dto.reason.trim(),
      activatedAt:
        dto.decision === "approved"
          ? now
          : null,
      updatedAt: now,
    };

    const approval = {
      id: randomUUID(),
      configurationId,
      decision: dto.decision,
      approver: dto.approver.trim(),
      reason: dto.reason.trim(),
      createdAt: now,
    };

    await this.store.mutate(
      (mutableState) => {
        const index =
          mutableState.configurations.findIndex(
            (item) =>
              item.id === configurationId,
          );

        mutableState.configurations[index] =
          updated;

        mutableState.approvals.push(
          approval,
        );

        if (
          dto.decision === "approved"
        ) {
          for (
            let i = 0;
            i <
            mutableState.configurations
              .length;
            i += 1
          ) {
            const candidate =
              mutableState.configurations[i];

            if (
              candidate.id !== updated.id &&
              candidate.key ===
                updated.key &&
              candidate.service ===
                updated.service &&
              candidate.environment ===
                updated.environment &&
              candidate.status === "active"
            ) {
              mutableState.configurations[i] =
                {
                  ...candidate,
                  status: "disabled",
                  updatedAt: now,
                };
            }
          }
        }
      },
    );

    await this.recordActivity({
      eventType:
        dto.decision === "approved"
          ? "configuration.change.approved"
          : "configuration.change.rejected",
      entityType: "configuration",
      entityId: updated.id,
      severity:
        dto.decision === "approved"
          ? "info"
          : "warning",
      message:
        `Configuration ${updated.key} ${dto.decision}`,
      payload: {
        configuration: updated,
        approval,
      },
    });

    return {
      configuration: updated,
      approval,
    };
  }

  async rollbackConfiguration(
    configurationId: string,
    dto: RollbackConfigurationDto,
  ) {
    const state = this.store.getSnapshot();

    const existing =
      state.configurations.find(
        (item) =>
          item.id === configurationId,
      );

    if (!existing) {
      throw new NotFoundException(
        `Configuration not found: ${configurationId}`,
      );
    }

    if (existing.status !== "active") {
      throw new ConflictException(
        "Only active configurations can be rolled back",
      );
    }

    if (existing.version <= 1) {
      throw new ConflictException(
        "No previous configuration version exists",
      );
    }

    const previous =
      state.configurations
        .filter(
          (item) =>
            item.key === existing.key &&
            item.service ===
              existing.service &&
            item.environment ===
              existing.environment &&
            item.version <
              existing.version,
        )
        .sort(
          (left, right) =>
            right.version - left.version,
        )[0];

    if (!previous) {
      throw new ConflictException(
        "Previous configuration version was not found",
      );
    }

    const now = new Date().toISOString();

    const rollbackVersion:
      ConfigurationEntry = {
      ...previous,
      id: randomUUID(),
      previousValue: existing.value,
      version: existing.version + 1,
      status: "active",
      requestedBy:
        "automatic-rollback-engine",
      approvedBy:
        "automatic-rollback-engine",
      approvalReason: dto.reason.trim(),
      createdAt: now,
      updatedAt: now,
      activatedAt: now,
    };

    const rollback = {
      id: randomUUID(),
      configurationId:
        existing.id,
      key: existing.key,
      service: existing.service,
      environment:
        existing.environment,
      fromVersion: existing.version,
      toVersion:
        rollbackVersion.version,
      reason: dto.reason.trim(),
      automatic: dto.automatic ?? false,
      createdAt: now,
    };

    await this.store.mutate(
      (mutableState) => {
        const index =
          mutableState.configurations.findIndex(
            (item) =>
              item.id === existing.id,
          );

        mutableState.configurations[index] =
          {
            ...existing,
            status: "rolled_back",
            updatedAt: now,
          };

        mutableState.configurations.push(
          rollbackVersion,
        );

        mutableState.rollbacks.push(
          rollback,
        );
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.rollback.completed",
      entityType: "configuration",
      entityId: rollbackVersion.id,
      severity: "warning",
      message:
        `Configuration ${existing.key} rolled back`,
      payload: {
        rollback,
        activeConfiguration:
          rollbackVersion,
      },
    });

    return {
      rollback,
      activeConfiguration:
        rollbackVersion,
    };
  }

  listPolicies() {
    return this.store
      .getSnapshot()
      .policies;
  }

  async createPolicy(
    dto: CreatePolicyDto,
  ) {
    const state = this.store.getSnapshot();

    const code = dto.code
      .trim()
      .toUpperCase();

    if (
      state.policies.some(
        (item) => item.code === code,
      )
    ) {
      throw new ConflictException(
        `Policy code already exists: ${code}`,
      );
    }

    if (
      dto.minimumNumber !== undefined &&
      dto.maximumNumber !== undefined &&
      dto.minimumNumber >
        dto.maximumNumber
    ) {
      throw new BadRequestException(
        "minimumNumber cannot exceed maximumNumber",
      );
    }

    try {
      new RegExp(dto.keyPattern);
    } catch {
      throw new BadRequestException(
        "keyPattern must be a valid regular expression",
      );
    }

    const now = new Date().toISOString();

    const policy: ConfigurationPolicy = {
      id: randomUUID(),
      code,
      name: dto.name.trim(),
      description:
        dto.description.trim(),
      service:
        dto.service?.trim() ?? null,
      environment:
        dto.environment ?? null,
      keyPattern: dto.keyPattern,
      severity: dto.severity,
      required: dto.required ?? false,
      immutableInProduction:
        dto.immutableInProduction ??
        false,
      allowedTypes:
        this.uniqueStrings(
          dto.allowedTypes ?? [],
        ),
      minimumNumber:
        dto.minimumNumber ?? null,
      maximumNumber:
        dto.maximumNumber ?? null,
      allowedValues:
        dto.allowedValues ?? [],
      blockedValues:
        dto.blockedValues ?? [],
      active: true,
      createdAt: now,
      updatedAt: now,
    };

    await this.store.mutate(
      (mutableState) => {
        mutableState.policies.push(policy);
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.policy.created",
      entityType:
        "configuration_policy",
      entityId: policy.id,
      severity: "info",
      message:
        `Configuration policy ${policy.code} created`,
      payload: policy,
    });

    return policy;
  }

  async createBaseline(
    dto: CreateBaselineDto,
  ) {
    const state = this.store.getSnapshot();

    const now = new Date().toISOString();

    const existing =
      state.baselines
        .filter(
          (item) =>
            item.service ===
              dto.service &&
            item.environment ===
              dto.environment,
        )
        .sort(
          (left, right) =>
            right.version - left.version,
        )[0];

    const baseline:
      ConfigurationBaseline = {
      id: randomUUID(),
      name: dto.name.trim(),
      service: dto.service.trim(),
      environment: dto.environment,
      configuration:
        dto.configuration,
      version:
        (existing?.version ?? 0) + 1,
      active: true,
      checksum: this.hash(
        this.stableStringify(
          dto.configuration,
        ),
      ),
      createdBy:
        dto.createdBy.trim(),
      createdAt: now,
      updatedAt: now,
    };

    await this.store.mutate(
      (mutableState) => {
        for (
          let i = 0;
          i <
          mutableState.baselines.length;
          i += 1
        ) {
          const item =
            mutableState.baselines[i];

          if (
            item.service ===
              baseline.service &&
            item.environment ===
              baseline.environment &&
            item.active
          ) {
            mutableState.baselines[i] = {
              ...item,
              active: false,
              updatedAt: now,
            };
          }
        }

        mutableState.baselines.push(
          baseline,
        );
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.baseline.created",
      entityType:
        "configuration_baseline",
      entityId: baseline.id,
      severity: "info",
      message:
        `Configuration baseline ${baseline.name} created`,
      payload: baseline,
    });

    return baseline;
  }

  async scanDrift(
    baselineId: string,
  ) {
    const state = this.store.getSnapshot();

    const baseline =
      state.baselines.find(
        (item) =>
          item.id === baselineId,
      );

    if (!baseline) {
      throw new NotFoundException(
        `Baseline not found: ${baselineId}`,
      );
    }

    const activeConfigurations =
      state.configurations.filter(
        (item) =>
          item.service ===
            baseline.service &&
          item.environment ===
            baseline.environment &&
          item.status === "active",
      );

    const runtimeConfiguration:
      Record<string, ConfigurationValue> =
        {};

    for (
      const item of activeConfigurations
    ) {
      runtimeConfiguration[item.key] =
        item.value;
    }

    const baselineKeys = Object.keys(
      baseline.configuration,
    );

    const runtimeKeys = Object.keys(
      runtimeConfiguration,
    );

    const missingKeys =
      baselineKeys.filter(
        (key) =>
          !(key in runtimeConfiguration),
      );

    const unexpectedKeys =
      runtimeKeys.filter(
        (key) =>
          !(key in baseline.configuration),
      );

    const changedKeys =
      baselineKeys.filter(
        (key) =>
          key in runtimeConfiguration &&
          this.stableStringify(
            runtimeConfiguration[key],
          ) !==
            this.stableStringify(
              baseline.configuration[key],
            ),
      );

    const totalKeys = Math.max(
      baselineKeys.length,
      1,
    );

    const violations =
      missingKeys.length +
      unexpectedKeys.length +
      changedKeys.length;

    const compliancePercentage =
      Math.max(
        0,
        Math.round(
          (1 -
            violations / totalKeys) *
            10000,
        ) / 100,
      );

    const status =
      missingKeys.length > 0 ||
      compliancePercentage < 70
        ? "critical_drift"
        : violations > 0
          ? "drifted"
          : "compliant";

    const drift = {
      id: randomUUID(),
      baselineId: baseline.id,
      service: baseline.service,
      environment:
        baseline.environment,
      status,
      missingKeys,
      unexpectedKeys,
      changedKeys,
      compliancePercentage,
      detectedAt:
        new Date().toISOString(),
    } as const;

    await this.store.mutate(
      (mutableState) => {
        mutableState.drifts.push(
          drift,
        );
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.drift.detected",
      entityType:
        "configuration_drift",
      entityId: drift.id,
      severity:
        status === "critical_drift"
          ? "critical"
          : status === "drifted"
            ? "warning"
            : "info",
      message:
        `Configuration drift scan completed: ${status}`,
      payload: drift,
    });

    return drift;
  }

  async createFeatureFlag(
    dto: CreateFeatureFlagDto,
  ) {
    const state = this.store.getSnapshot();

    if (
      state.featureFlags.some(
        (item) =>
          item.key === dto.key &&
          item.service === dto.service &&
          item.environment ===
            dto.environment,
      )
    ) {
      throw new ConflictException(
        `Feature flag already exists: ${dto.key}`,
      );
    }

    const now = new Date().toISOString();

    const flag: FeatureFlag = {
      id: randomUUID(),
      key: dto.key.trim(),
      name: dto.name.trim(),
      description:
        dto.description?.trim() ?? null,
      service: dto.service.trim(),
      environment: dto.environment,
      enabled: dto.enabled ?? false,
      strategy: dto.strategy,
      rolloutPercentage:
        dto.rolloutPercentage ??
        (dto.strategy === "all"
          ? 100
          : 0),
      targetServices:
        this.uniqueStrings(
          dto.targetServices ?? [],
        ),
      targetUsers:
        this.uniqueStrings(
          dto.targetUsers ?? [],
        ),
      metadata: dto.metadata ?? {},
      version: 1,
      createdBy:
        dto.createdBy.trim(),
      updatedBy:
        dto.createdBy.trim(),
      createdAt: now,
      updatedAt: now,
    };

    await this.store.mutate(
      (mutableState) => {
        mutableState.featureFlags.push(
          flag,
        );
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.feature_flag.created",
      entityType: "feature_flag",
      entityId: flag.id,
      severity: "info",
      message:
        `Feature flag ${flag.key} created`,
      payload: flag,
    });

    return flag;
  }

  async updateFeatureFlag(
    flagId: string,
    dto: UpdateFeatureFlagDto,
  ) {
    const state = this.store.getSnapshot();

    const existing =
      state.featureFlags.find(
        (item) => item.id === flagId,
      );

    if (!existing) {
      throw new NotFoundException(
        `Feature flag not found: ${flagId}`,
      );
    }

    const updated: FeatureFlag = {
      ...existing,
      enabled:
        dto.enabled ??
        existing.enabled,
      strategy:
        dto.strategy ??
        existing.strategy,
      rolloutPercentage:
        dto.rolloutPercentage ??
        existing.rolloutPercentage,
      targetServices:
        dto.targetServices
          ? this.uniqueStrings(
              dto.targetServices,
            )
          : existing.targetServices,
      targetUsers:
        dto.targetUsers
          ? this.uniqueStrings(
              dto.targetUsers,
            )
          : existing.targetUsers,
      metadata:
        dto.metadata ??
        existing.metadata,
      version:
        existing.version + 1,
      updatedBy:
        dto.updatedBy.trim(),
      updatedAt:
        new Date().toISOString(),
    };

    await this.store.mutate(
      (mutableState) => {
        const index =
          mutableState.featureFlags.findIndex(
            (item) =>
              item.id === flagId,
          );

        mutableState.featureFlags[index] =
          updated;
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.feature_flag.updated",
      entityType: "feature_flag",
      entityId: updated.id,
      severity: "info",
      message:
        `Feature flag ${updated.key} updated`,
      payload: updated,
    });

    return updated;
  }

  async evaluateFeatureFlag(
    flagId: string,
    context: {
      userId?: string;
      service?: string;
    },
  ) {
    const flag =
      this.store
        .getSnapshot()
        .featureFlags.find(
          (item) => item.id === flagId,
        );

    if (!flag) {
      throw new NotFoundException(
        `Feature flag not found: ${flagId}`,
      );
    }

    let enabled = flag.enabled;

    if (!flag.enabled) {
      enabled = false;
    } else if (
      flag.strategy === "percentage"
    ) {
      const identity =
        context.userId ??
        context.service ??
        "anonymous";

      const bucket =
        parseInt(
          this.hash(identity).slice(0, 8),
          16,
        ) % 100;

      enabled =
        bucket <
        flag.rolloutPercentage;
    } else if (
      flag.strategy === "service"
    ) {
      enabled =
        Boolean(context.service) &&
        flag.targetServices.includes(
          context.service as string,
        );
    } else if (
      flag.strategy === "manual"
    ) {
      enabled =
        Boolean(context.userId) &&
        flag.targetUsers.includes(
          context.userId as string,
        );
    }

    return {
      success: true,
      flagId: flag.id,
      key: flag.key,
      enabled,
      strategy: flag.strategy,
      version: flag.version,
    };
  }

  async createKillSwitch(
    dto: CreateKillSwitchDto,
  ) {
    const state = this.store.getSnapshot();

    const code = dto.code
      .trim()
      .toUpperCase();

    if (
      state.killSwitches.some(
        (item) => item.code === code,
      )
    ) {
      throw new ConflictException(
        `Kill switch code already exists: ${code}`,
      );
    }

    const now = new Date().toISOString();

    const killSwitch: KillSwitch = {
      id: randomUUID(),
      code,
      name: dto.name.trim(),
      service: dto.service.trim(),
      environment: dto.environment,
      status: "armed",
      reason: null,
      activatedBy: null,
      activatedAt: null,
      releasedBy: null,
      releasedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    await this.store.mutate(
      (mutableState) => {
        mutableState.killSwitches.push(
          killSwitch,
        );
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.kill_switch.created",
      entityType: "kill_switch",
      entityId: killSwitch.id,
      severity: "warning",
      message:
        `Kill switch ${killSwitch.code} armed`,
      payload: killSwitch,
    });

    return killSwitch;
  }

  async activateKillSwitch(
    switchId: string,
    dto: ActivateKillSwitchDto,
  ) {
    const state = this.store.getSnapshot();

    const existing =
      state.killSwitches.find(
        (item) => item.id === switchId,
      );

    if (!existing) {
      throw new NotFoundException(
        `Kill switch not found: ${switchId}`,
      );
    }

    if (
      existing.status === "activated"
    ) {
      throw new ConflictException(
        "Kill switch is already activated",
      );
    }

    const now = new Date().toISOString();

    const updated: KillSwitch = {
      ...existing,
      status: "activated",
      reason: dto.reason.trim(),
      activatedBy:
        dto.activatedBy.trim(),
      activatedAt: now,
      releasedBy: null,
      releasedAt: null,
      updatedAt: now,
    };

    await this.store.mutate(
      (mutableState) => {
        const index =
          mutableState.killSwitches.findIndex(
            (item) =>
              item.id === switchId,
          );

        mutableState.killSwitches[index] =
          updated;

        for (
          let i = 0;
          i <
          mutableState.featureFlags.length;
          i += 1
        ) {
          const flag =
            mutableState.featureFlags[i];

          if (
            flag.service ===
              updated.service &&
            flag.environment ===
              updated.environment &&
            flag.enabled
          ) {
            mutableState.featureFlags[i] =
              {
                ...flag,
                enabled: false,
                version:
                  flag.version + 1,
                updatedBy:
                  "kill-switch-engine",
                updatedAt: now,
              };
          }
        }
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.kill_switch.activated",
      entityType: "kill_switch",
      entityId: updated.id,
      severity: "critical",
      message:
        `Kill switch ${updated.code} activated`,
      payload: updated,
    });

    return updated;
  }

  async releaseKillSwitch(
    switchId: string,
    dto: ReleaseKillSwitchDto,
  ) {
    const state = this.store.getSnapshot();

    const existing =
      state.killSwitches.find(
        (item) => item.id === switchId,
      );

    if (!existing) {
      throw new NotFoundException(
        `Kill switch not found: ${switchId}`,
      );
    }

    if (
      existing.status !== "activated"
    ) {
      throw new ConflictException(
        "Only activated kill switches can be released",
      );
    }

    const now = new Date().toISOString();

    const updated: KillSwitch = {
      ...existing,
      status: "released",
      releasedBy:
        dto.releasedBy.trim(),
      releasedAt: now,
      updatedAt: now,
    };

    await this.store.mutate(
      (mutableState) => {
        const index =
          mutableState.killSwitches.findIndex(
            (item) =>
              item.id === switchId,
          );

        mutableState.killSwitches[index] =
          updated;
      },
    );

    await this.recordActivity({
      eventType:
        "configuration.kill_switch.released",
      entityType: "kill_switch",
      entityId: updated.id,
      severity: "warning",
      message:
        `Kill switch ${updated.code} released`,
      payload: updated,
    });

    return updated;
  }

  verifyEvidenceChain() {
    return {
      success: true,
      ...this.store.verifyEvidenceChain(),
    };
  }

  private evaluateConfigurationRules(
    configuration: ConfigurationEntry,
    policies: ConfigurationPolicy[],
    previous:
      ConfigurationEntry | null,
  ): PolicyEvaluation {
    const violations: string[] = [];
    const warnings: string[] = [];
    const passedChecks: string[] = [];

    const applicablePolicies =
      policies.filter((policy) => {
        if (!policy.active) {
          return false;
        }

        if (
          policy.service &&
          policy.service !==
            configuration.service
        ) {
          return false;
        }

        if (
          policy.environment &&
          policy.environment !==
            configuration.environment
        ) {
          return false;
        }

        return new RegExp(
          policy.keyPattern,
        ).test(configuration.key);
      });

    for (
      const policy of applicablePolicies
    ) {
      const messages: string[] = [];

      const type =
        Array.isArray(
          configuration.value,
        )
          ? "array"
          : configuration.value === null
            ? "null"
            : typeof configuration.value;

      if (
        policy.allowedTypes.length > 0 &&
        !policy.allowedTypes.includes(type)
      ) {
        messages.push(
          `Value type ${type} is not allowed by policy ${policy.code}`,
        );
      }

      if (
        typeof configuration.value ===
        "number"
      ) {
        if (
          policy.minimumNumber !== null &&
          configuration.value <
            policy.minimumNumber
        ) {
          messages.push(
            `Value is below minimum ${policy.minimumNumber}`,
          );
        }

        if (
          policy.maximumNumber !== null &&
          configuration.value >
            policy.maximumNumber
        ) {
          messages.push(
            `Value exceeds maximum ${policy.maximumNumber}`,
          );
        }
      }

      if (
        policy.allowedValues.length > 0 &&
        !policy.allowedValues.some(
          (value) =>
            this.stableStringify(value) ===
            this.stableStringify(
              configuration.value,
            ),
        )
      ) {
        messages.push(
          `Value is not included in policy ${policy.code} allowed values`,
        );
      }

      if (
        policy.blockedValues.some(
          (value) =>
            this.stableStringify(value) ===
            this.stableStringify(
              configuration.value,
            ),
        )
      ) {
        messages.push(
          `Value is blocked by policy ${policy.code}`,
        );
      }

      if (
        policy.immutableInProduction &&
        configuration.environment ===
          "production" &&
        previous
      ) {
        messages.push(
          `Production configuration is immutable under policy ${policy.code}`,
        );
      }

      if (messages.length === 0) {
        passedChecks.push(
          `Policy ${policy.code} passed`,
        );
      } else if (
        policy.severity === "critical" ||
        policy.severity === "high"
      ) {
        violations.push(...messages);
      } else {
        warnings.push(...messages);
      }
    }

    const result =
      violations.length > 0
        ? "blocked"
        : warnings.length > 0
          ? "warning"
          : "passed";

    const score = Math.max(
      0,
      100 -
        violations.length * 30 -
        warnings.length * 10,
    );

    return {
      id: randomUUID(),
      configurationId:
        configuration.id,
      key: configuration.key,
      service:
        configuration.service,
      environment:
        configuration.environment,
      result,
      score,
      violations,
      warnings,
      passedChecks,
      evaluatedAt:
        new Date().toISOString(),
    };
  }

  private async bootstrapDefaults() {
    const state = this.store.getSnapshot();

    if (state.policies.length === 0) {
      await this.createPolicy({
        code:
          "AVOS-PRODUCTION-TIMEOUT",
        name:
          "Production timeout protection",
        description:
          "Ensures production timeout values remain within safe operational limits",
        service: "avos-api",
        environment: "production",
        keyPattern:
          "^http\\.timeoutMs$",
        severity: "critical",
        required: true,
        immutableInProduction: false,
        allowedTypes: ["number"],
        minimumNumber: 1000,
        maximumNumber: 30000,
        allowedValues: [],
        blockedValues: [],
      });

      await this.createPolicy({
        code:
          "AVOS-DANGEROUS-FEATURES",
        name:
          "Dangerous feature protection",
        description:
          "Blocks explicitly dangerous production feature values",
        service: "avos-api",
        environment: "production",
        keyPattern:
          "^features\\.dangerousMode$",
        severity: "critical",
        required: false,
        immutableInProduction: false,
        allowedTypes: ["boolean"],
        allowedValues: [false],
        blockedValues: [true],
      });
    }

    const refreshed =
      this.store.getSnapshot();

    if (
      refreshed.baselines.length === 0
    ) {
      await this.createBaseline({
        name:
          "AVOS API Golden Production Baseline",
        service: "avos-api",
        environment: "production",
        configuration: {
          "http.timeoutMs": 10000,
          "features.dangerousMode": false,
        },
        createdBy:
          "AVOS Platform Governance",
      });
    }

    if (
      refreshed.killSwitches.length === 0
    ) {
      await this.createKillSwitch({
        code:
          "AVOS-API-EMERGENCY-STOP",
        name:
          "AVOS API Emergency Stop",
        service: "avos-api",
        environment: "production",
      });
    }

    await this.store.appendEvent({
      eventType:
        "configuration.module.initialized",
      entityType: "system",
      entityId: null,
      severity: "info",
      message:
        "Production Hardening V7 Mega Pack 8 initialized",
      metadata: {
        version: "v7-mega-pack-8",
      },
    });
  }

  private async recordActivity(params: {
    eventType: string;
    entityType: string;
    entityId: string;
    severity:
      | "info"
      | "warning"
      | "critical";
    message: string;
    payload: unknown;
  }) {
    await this.store.appendEvidence({
      evidenceType:
        params.eventType,
      entityType:
        params.entityType,
      entityId:
        params.entityId,
      payload: params.payload,
    });

    await this.store.appendEvent({
      eventType:
        params.eventType,
      entityType:
        params.entityType,
      entityId:
        params.entityId,
      severity:
        params.severity,
      message: params.message,
      metadata: {
        evidenceRecorded: true,
      },
    });
  }

  private uniqueStrings(
    values: string[],
  ) {
    return [
      ...new Set(
        values
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];
  }

  private hash(value: string) {
    return createHash("sha256")
      .update(value)
      .digest("hex");
  }

  private stableStringify(
    value: unknown,
  ): string {
    const normalize = (
      item: unknown,
    ): unknown => {
      if (Array.isArray(item)) {
        return item.map(normalize);
      }

      if (
        item &&
        typeof item === "object"
      ) {
        return Object.fromEntries(
          Object.entries(
            item as Record<string, unknown>,
          )
            .sort(([left], [right]) =>
              left.localeCompare(right),
            )
            .map(([key, nested]) => [
              key,
              normalize(nested),
            ]),
        );
      }

      return item;
    };

    return JSON.stringify(
      normalize(value),
    );
  }
}
