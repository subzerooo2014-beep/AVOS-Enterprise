"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class JwtService {
    static sign(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "development-secret", { expiresIn: "1h" });
    }
    static verify(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "development-secret");
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.service.js.map