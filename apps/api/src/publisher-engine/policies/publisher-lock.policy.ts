export class PublisherLockPolicy {
  static isExpired(job: any, ttlMinutes = 10) {
    if (!job.lockedAt) return true;
    const lockedAt = new Date(job.lockedAt).getTime();
    return Date.now() - lockedAt > ttlMinutes * 60 * 1000;
  }
}
