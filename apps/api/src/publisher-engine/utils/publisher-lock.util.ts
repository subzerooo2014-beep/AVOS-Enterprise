export class PublisherLockUtil {
  static expired(lockedAt?: Date | string | null, timeoutMinutes = 10) {
    if (!lockedAt) return true;

    const value = new Date(lockedAt).getTime();
    return Date.now() - value > timeoutMinutes * 60 * 1000;
  }

  static token(jobId: string) {
    return `pub_lock_${jobId}_${Date.now()}`;
  }
}
