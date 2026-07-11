export const PublisherEvents = {
  JOB_CREATED: "publisher.job.created",
  JOB_QUEUED: "publisher.job.queued",
  JOB_LOCKED: "publisher.job.locked",
  JOB_STARTED: "publisher.job.started",
  JOB_COMPLETED: "publisher.job.completed",
  JOB_FAILED: "publisher.job.failed",
  JOB_RETRY: "publisher.job.retry",
  JOB_CANCELLED: "publisher.job.cancelled",
  JOB_SKIPPED: "publisher.job.skipped",
  JOB_DEAD: "publisher.job.dead",
} as const;
