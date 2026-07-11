"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherPriorityUtil = void 0;
class PublisherPriorityUtil {
    static normalize(priority) {
        return String(priority ?? "normal").toLowerCase();
    }
    static weight(priority) {
        return this.weights[this.normalize(priority)] ?? 3;
    }
    static compare(a, b) {
        return this.weight(a) - this.weight(b);
    }
}
exports.PublisherPriorityUtil = PublisherPriorityUtil;
PublisherPriorityUtil.weights = {
    urgent: 1,
    high: 2,
    normal: 3,
    low: 4,
};
//# sourceMappingURL=publisher-priority.util.js.map