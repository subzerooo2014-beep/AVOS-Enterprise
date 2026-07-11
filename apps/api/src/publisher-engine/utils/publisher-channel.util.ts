export class PublisherChannelUtil {
  static normalize(channel?: string | null) {
    return String(channel ?? "internal").trim().toLowerCase();
  }

  static supported() {
    return [
      "website",
      "dealer_network",
      "crm_leads",
      "matched_buyers",
      "gcc_export",
      "internal",
    ];
  }

  static exists(channel?: string | null) {
    return this.supported().includes(this.normalize(channel));
  }

  static fallback(channel?: string | null) {
    return this.exists(channel)
      ? this.normalize(channel)
      : "internal";
  }
}
