export class PublisherRetryPolicy {
  static shouldRetry(job: any) {
    const retryCount = Number(job.retryCount ?? 0);
    const maxRetries = Number(job.maxRetries ?? 3);
    return retryCount < maxRetries;
  }

  static nextStatus(job: any) {
    return this.shouldRetry(job) ? "queued" : "dead";
  }
}
