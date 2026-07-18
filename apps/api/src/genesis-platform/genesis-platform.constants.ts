export const GENESIS_PLATFORM_VERSION = "1.0.0";

export const GENESIS_PLATFORM_CLASSIFICATION =
  "blueprint-driven-governed-system-generation-platform";

export const GENESIS_HUMAN_FINAL_AUTHORITY = true;
export const GENESIS_AUTONOMOUS_EXECUTION_ENABLED = false;

export const GENESIS_REQUIRED_APPROVAL_STATES = [
  "draft",
  "awaiting-human-approval",
  "approved",
  "rejected",
] as const;
