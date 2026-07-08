"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSearch = normalizeSearch;
exports.containsText = containsText;
function normalizeSearch(value) {
    return String(value ?? "").trim().toLowerCase();
}
function containsText(source, search) {
    const src = normalizeSearch(source);
    const txt = normalizeSearch(search);
    if (!txt)
        return true;
    return src.includes(txt);
}
//# sourceMappingURL=sales-search.helper.js.map