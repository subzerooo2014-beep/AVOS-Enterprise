"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const bcrypt = require("bcrypt");
class PasswordService {
    hash(password) {
        return bcrypt.hash(password, 12);
    }
    compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
exports.PasswordService = PasswordService;
//# sourceMappingURL=password.service.js.map