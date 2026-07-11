"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PublisherRegistryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherRegistryService = void 0;
const common_1 = require("@nestjs/common");
let PublisherRegistryService = PublisherRegistryService_1 = class PublisherRegistryService {
    constructor() {
        this.logger = new common_1.Logger(PublisherRegistryService_1.name);
        this.adapters = new Map();
        this.aliases = new Map();
        this.metadata = new Map();
    }
    register(adapter, options) {
        this.validateAdapter(adapter);
        const channel = this.normalizeChannel(adapter.channel);
        const replace = options?.replace === true;
        if (this.adapters.has(channel) && !replace) {
            throw new Error(`Publisher channel "${channel}" is already registered`);
        }
        if (replace && this.adapters.has(channel)) {
            this.unregister(channel);
        }
        const normalizedAliases = Array.from(new Set((options?.aliases ?? [])
            .map((alias) => this.normalizeChannel(alias))
            .filter((alias) => alias !== channel)));
        for (const alias of normalizedAliases) {
            if (this.adapters.has(alias)) {
                throw new Error(`Publisher alias "${alias}" conflicts with an existing channel`);
            }
            const aliasOwner = this.aliases.get(alias);
            if (aliasOwner && aliasOwner !== channel) {
                throw new Error(`Publisher alias "${alias}" is already owned by "${aliasOwner}"`);
            }
        }
        this.adapters.set(channel, adapter);
        for (const alias of normalizedAliases) {
            this.aliases.set(alias, channel);
        }
        this.metadata.set(channel, {
            channel,
            aliases: normalizedAliases,
            displayName: options?.displayName?.trim() || channel,
            registeredAt: new Date(),
        });
        this.logger.log(`Publisher registered: ${channel}${normalizedAliases.length
            ? ` [aliases: ${normalizedAliases.join(", ")}]`
            : ""}`);
        return adapter;
    }
    registerMany(adapters) {
        const registered = [];
        try {
            for (const adapter of adapters) {
                registered.push(this.register(adapter));
            }
            return registered;
        }
        catch (error) {
            for (const adapter of registered.reverse()) {
                this.unregister(adapter.channel);
            }
            throw error;
        }
    }
    unregister(channelOrAlias) {
        const channel = this.resolveChannel(channelOrAlias);
        const adapter = this.adapters.get(channel);
        if (!adapter) {
            return false;
        }
        const registration = this.metadata.get(channel);
        if (registration) {
            for (const alias of registration.aliases) {
                this.aliases.delete(alias);
            }
        }
        this.adapters.delete(channel);
        this.metadata.delete(channel);
        this.logger.log(`Publisher unregistered: ${channel}`);
        return true;
    }
    get(channelOrAlias) {
        const channel = this.resolveChannel(channelOrAlias);
        const adapter = this.adapters.get(channel);
        if (!adapter) {
            const channels = this.list();
            throw new Error(channels.length > 0
                ? `Publisher "${channelOrAlias}" is not registered. Available channels: ${channels.join(", ")}`
                : `Publisher "${channelOrAlias}" is not registered. Publisher registry is empty.`);
        }
        return adapter;
    }
    find(channelOrAlias) {
        const channel = this.resolveChannel(channelOrAlias);
        return this.adapters.get(channel);
    }
    exists(channelOrAlias) {
        const channel = this.resolveChannel(channelOrAlias);
        return this.adapters.has(channel);
    }
    has(channelOrAlias) {
        return this.exists(channelOrAlias);
    }
    list() {
        return Array.from(this.adapters.keys()).sort((left, right) => left.localeCompare(right));
    }
    listMetadata() {
        return Array.from(this.metadata.values())
            .sort((left, right) => left.channel.localeCompare(right.channel))
            .map((item) => ({
            ...item,
            aliases: [...item.aliases],
        }));
    }
    count() {
        return this.adapters.size;
    }
    async health() {
        const output = [];
        for (const channel of this.list()) {
            const adapter = this.get(channel);
            try {
                output.push({
                    channel,
                    status: await adapter.health(),
                });
            }
            catch (error) {
                output.push({
                    channel,
                    status: "offline",
                    error: this.errorMessage(error),
                });
            }
        }
        return output;
    }
    async onApplicationShutdown() {
        this.adapters.clear();
        this.aliases.clear();
        this.metadata.clear();
    }
    resolveChannel(channelOrAlias) {
        const normalized = this.normalizeChannel(channelOrAlias);
        return this.aliases.get(normalized) ?? normalized;
    }
    normalizeChannel(value) {
        if (typeof value !== "string" || !value.trim()) {
            throw new Error("Publisher channel must be a non-empty string");
        }
        const normalized = value.trim().toLowerCase();
        if (!/^[a-z0-9][a-z0-9._:-]*$/.test(normalized)) {
            throw new Error(`Invalid publisher channel "${value}". Use letters, numbers, dots, underscores, colons or hyphens.`);
        }
        return normalized;
    }
    validateAdapter(adapter) {
        if (!adapter || typeof adapter !== "object") {
            throw new Error("Publisher adapter must be an object");
        }
        if (typeof adapter.channel !== "string" ||
            !adapter.channel.trim()) {
            throw new Error("Publisher adapter must expose a non-empty channel");
        }
        if (typeof adapter.health !== "function") {
            throw new Error(`Publisher adapter "${adapter.channel}" must implement health()`);
        }
        if (typeof adapter.publish !== "function") {
            throw new Error(`Publisher adapter "${adapter.channel}" must implement publish()`);
        }
    }
    errorMessage(error) {
        return error instanceof Error
            ? error.message
            : String(error ?? "Unknown publisher error");
    }
};
exports.PublisherRegistryService = PublisherRegistryService;
exports.PublisherRegistryService = PublisherRegistryService = PublisherRegistryService_1 = __decorate([
    (0, common_1.Injectable)()
], PublisherRegistryService);
//# sourceMappingURL=publisher-registry.service.js.map