export class GeneratorRuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class PluginNotFoundError extends GeneratorRuntimeError {
  constructor(pluginId: string) {
    super(`Generator plugin "${pluginId}" was not found.`);
  }
}

export class UnsupportedTargetError extends GeneratorRuntimeError {
  constructor(pluginId: string, target: string) {
    super(
      `Generator plugin "${pluginId}" does not support target "${target}".`
    );
  }
}

export class GenerationFailedError extends GeneratorRuntimeError {
  constructor(pluginId: string, reason: string) {
    super(`Generation failed for "${pluginId}": ${reason}`);
  }
}
