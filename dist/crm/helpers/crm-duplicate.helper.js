"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeIdentity = normalizeIdentity;
exports.buildDuplicateKey = buildDuplicateKey;
exports.findDuplicateGroups = findDuplicateGroups;
function normalizeIdentity(value) {
    return String(value ?? "").trim().toLowerCase();
}
function buildDuplicateKey(record) {
    const email = normalizeIdentity(record?.email);
    const phone = normalizeIdentity(record?.phone);
    const name = normalizeIdentity(record?.name);
    return email || phone || name;
}
function findDuplicateGroups(items) {
    const map = new Map();
    for (const item of items ?? []) {
        const key = buildDuplicateKey(item);
        if (!key)
            continue;
        const current = map.get(key) ?? [];
        current.push(item);
        map.set(key, current);
    }
    return Array.from(map.entries())
        .filter(([, values]) => values.length > 1)
        .map(([key, values]) => ({ key, count: values.length, items: values }));
}
//# sourceMappingURL=crm-duplicate.helper.js.map