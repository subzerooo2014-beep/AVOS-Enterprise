export const PUBLISH_JOB_STATUS = {
  QUEUED: "queued",
  LOCKED: "locked",
  PROCESSING: "processing",
  PUBLISHED: "published",
  FAILED: "failed",
  RETRYING: "retrying",
  SKIPPED: "skipped",
  DEAD: "dead",
} as const;

export const PUBLISH_PRIORITY = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const PUBLISHER_WORKER_ID = "avos-publisher-engine-v2";
