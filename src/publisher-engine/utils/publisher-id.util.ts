export function makeLockToken(jobId: string) {
  return `lock_${jobId}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function makeCorrelationId(jobId: string) {
  return `pub_${jobId}_${Date.now()}`;
}
