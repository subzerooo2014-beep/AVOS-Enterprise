"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUpEngine = void 0;
class FollowUpEngine {
    next(days) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d;
    }
}
exports.FollowUpEngine = FollowUpEngine;
//# sourceMappingURL=follow-up.engine.js.map