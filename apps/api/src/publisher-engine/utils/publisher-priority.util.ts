export class PublisherPriorityUtil {
  private static readonly weights: Record<string, number> = {
    urgent: 1,
    high: 2,
    normal: 3,
    low: 4,
  };

  static normalize(priority?: string | null) {
    return String(priority ?? "normal").toLowerCase();
  }

  static weight(priority?: string | null) {
    return this.weights[this.normalize(priority)] ?? 3;
  }

  static compare(a?: string | null, b?: string | null) {
    return this.weight(a) - this.weight(b);
  }
}
