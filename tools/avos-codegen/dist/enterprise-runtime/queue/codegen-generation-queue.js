"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationQueue = void 0;
class CodeGenGenerationQueue {
    jobs = [];
    enqueue(job) { this.jobs.push(job); }
    dequeue() { return this.jobs.shift(); }
    list() { return [...this.jobs]; }
}
exports.CodeGenGenerationQueue = CodeGenGenerationQueue;
//# sourceMappingURL=codegen-generation-queue.js.map