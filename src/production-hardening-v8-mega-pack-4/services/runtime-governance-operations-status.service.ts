import { Injectable } from "@nestjs/common";
import {
  GovernanceEscalationSeverity,
  GovernanceEscalationStatus,
  GovernanceNotificationStatus,
  GovernanceOperationsSnapshot,
  GovernanceScheduleRunStatus,
  GovernanceScheduleStatus,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class RuntimeGovernanceOperationsStatusService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  snapshot():
    GovernanceOperationsSnapshot {
    const schedules =
      this.store
        .listGovernanceSchedules();

    const runs =
      this.store
        .listGovernanceScheduleRuns();

    const escalations =
      this.store
        .listGovernanceEscalations();

    const notifications =
      this.store
        .listGovernanceNotifications();

    return {
      schedules:
        schedules.length,
      activeSchedules:
        schedules.filter(
          (item) =>
            item.status ===
            GovernanceScheduleStatus.ACTIVE,
        ).length,
      failedSchedules:
        schedules.filter(
          (item) =>
            item.status ===
            GovernanceScheduleStatus.FAILED,
        ).length,
      scheduleRuns:
        runs.length,
      failedScheduleRuns:
        runs.filter(
          (item) =>
            item.status ===
            GovernanceScheduleRunStatus.FAILED,
        ).length,
      escalations:
        escalations.length,
      openEscalations:
        escalations.filter(
          (item) =>
            [
              GovernanceEscalationStatus.OPEN,
              GovernanceEscalationStatus.ACKNOWLEDGED,
              GovernanceEscalationStatus.IN_PROGRESS,
            ].includes(
              item.status,
            ),
        ).length,
      criticalEscalations:
        escalations.filter(
          (item) =>
            [
              GovernanceEscalationSeverity.CRITICAL,
              GovernanceEscalationSeverity.EMERGENCY,
            ].includes(
              item.severity,
            ) &&
            ![
              GovernanceEscalationStatus.RESOLVED,
              GovernanceEscalationStatus.CANCELLED,
              GovernanceEscalationStatus.EXPIRED,
            ].includes(
              item.status,
            ),
        ).length,
      notifications:
        notifications.length,
      pendingNotifications:
        notifications.filter(
          (item) =>
            [
              GovernanceNotificationStatus.PENDING,
              GovernanceNotificationStatus.QUEUED,
            ].includes(
              item.status,
            ),
        ).length,
      failedNotifications:
        notifications.filter(
          (item) =>
            item.status ===
            GovernanceNotificationStatus.FAILED,
        ).length,
      timelineEvents:
        this.store
          .listGovernanceTimeline()
          .length,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
