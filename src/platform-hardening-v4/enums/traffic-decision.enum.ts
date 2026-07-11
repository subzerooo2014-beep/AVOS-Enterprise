export enum TrafficDecision {
  ALLOW = "allow",
  RATE_LIMIT = "rate_limit",
  CONCURRENCY_LIMIT = "concurrency_limit",
  LOAD_SHED = "load_shed",
  MAINTENANCE = "maintenance",
  EMERGENCY_BLOCK = "emergency_block",
}
