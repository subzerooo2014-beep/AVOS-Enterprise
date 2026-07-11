"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePublisher = void 0;
class BasePublisher {
    async health() {
        return "healthy";
    }
    async publish(ctx) {
        const simulation = this.simulationOf(ctx);
        if (simulation.mode === "retryable-failure") {
            return {
                status: "failed",
                channel: this.channel,
                message: simulation.message ||
                    "Temporary service unavailable. Simulated retryable publisher failure.",
                metadata: {
                    simulation: true,
                    simulationMode: simulation.mode,
                    attempt: ctx.attempt,
                    vehicleId: ctx.vehicleId,
                    correlationId: ctx.correlationId,
                },
            };
        }
        if (simulation.mode === "timeout") {
            throw new Error(simulation.message ||
                "Publisher request timed out during simulated execution.");
        }
        if (simulation.mode === "network-error") {
            throw new Error(simulation.message ||
                "ECONNRESET simulated publisher network connection failure.");
        }
        if (simulation.mode === "non-retryable-failure") {
            return {
                status: "failed",
                channel: this.channel,
                message: simulation.message ||
                    "Invalid payload. Simulated non-retryable publisher failure.",
                metadata: {
                    simulation: true,
                    simulationMode: simulation.mode,
                    attempt: ctx.attempt,
                    vehicleId: ctx.vehicleId,
                    correlationId: ctx.correlationId,
                },
            };
        }
        if (simulation.mode === "skip") {
            return {
                status: "skipped",
                channel: this.channel,
                message: simulation.message ||
                    "Publisher execution skipped by simulation policy.",
                metadata: {
                    simulation: true,
                    simulationMode: simulation.mode,
                    attempt: ctx.attempt,
                    vehicleId: ctx.vehicleId,
                    correlationId: ctx.correlationId,
                },
            };
        }
        return {
            status: "published",
            channel: this.channel,
            externalId: `AVOS-${this.channel}-${ctx.jobId}`,
            message: `${this.channel} publisher executed successfully.`,
            metadata: {
                version: "v2",
                vehicleId: ctx.vehicleId,
                campaignId: ctx.campaignId,
                channelId: ctx.channelId,
                title: ctx.title,
                attempt: ctx.attempt,
                correlationId: ctx.correlationId,
            },
        };
    }
    simulationOf(ctx) {
        const source = ctx.result?.simulate ??
            ctx.result?.metadata?.simulate ??
            ctx.metadata?.simulate ??
            null;
        if (!source) {
            return {
                mode: "success",
            };
        }
        if (typeof source === "string") {
            return {
                mode: source.trim().toLowerCase(),
            };
        }
        if (typeof source === "object" &&
            !Array.isArray(source)) {
            return {
                mode: String(source.mode ?? "success")
                    .trim()
                    .toLowerCase(),
                message: typeof source.message === "string"
                    ? source.message.trim()
                    : undefined,
            };
        }
        return {
            mode: "success",
        };
    }
}
exports.BasePublisher = BasePublisher;
//# sourceMappingURL=base.publisher.js.map