import { Injectable } from "@nestjs/common";

@Injectable()
export class ObjectPathService {
  get(
    source: unknown,
    resourcePath: string,
  ): unknown {
    if (!resourcePath) {
      return source;
    }

    const segments = resourcePath
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);

    let current: unknown = source;

    for (const segment of segments) {
      if (
        current === null ||
        current === undefined ||
        typeof current !== "object"
      ) {
        return undefined;
      }

      current = (
        current as Record<string, unknown>
      )[segment];
    }

    return current;
  }

  exists(
    source: unknown,
    resourcePath: string,
  ): boolean {
    return (
      this.get(
        source,
        resourcePath,
      ) !== undefined
    );
  }
}
