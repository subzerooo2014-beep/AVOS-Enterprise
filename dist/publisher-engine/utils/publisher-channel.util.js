"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherChannelUtil = void 0;
class PublisherChannelUtil {
    static normalize(channel) {
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
    static exists(channel) {
        return this.supported().includes(this.normalize(channel));
    }
    static fallback(channel) {
        return this.exists(channel)
            ? this.normalize(channel)
            : "internal";
    }
}
exports.PublisherChannelUtil = PublisherChannelUtil;
//# sourceMappingURL=publisher-channel.util.js.map