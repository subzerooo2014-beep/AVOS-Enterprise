"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersPolicy = void 0;
class CustomersPolicy {
    static canRead(user) {
        return !!user;
    }
    static canCreate(user) {
        return !!user;
    }
    static canWrite(user) {
        return !!user;
    }
    static canDelete(user) {
        return !!user && user.role === "ADMIN";
    }
    static canRestore(user) {
        return !!user && user.role === "ADMIN";
    }
    static canExport(user) {
        return !!user;
    }
    static canImport(user) {
        return !!user && ["ADMIN", "MANAGER"].includes(user.role);
    }
}
exports.CustomersPolicy = CustomersPolicy;
//# sourceMappingURL=customers.policy.js.map