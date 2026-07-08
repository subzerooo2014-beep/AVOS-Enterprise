"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetStore = void 0;
const crypto_1 = require("crypto");
class PasswordResetStore {
    static create(email) {
        const token = (0, crypto_1.randomUUID)();
        this.tokens.set(token, email);
        return token;
    }
    static consume(token) {
        const email = this.tokens.get(token);
        if (email)
            this.tokens.delete(token);
        return email;
    }
}
exports.PasswordResetStore = PasswordResetStore;
PasswordResetStore.tokens = new Map();
//# sourceMappingURL=password-reset.store.js.map