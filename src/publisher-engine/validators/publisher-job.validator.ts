export class PublisherJobValidator {
  static validateCreate(dto: any) {
    if (!dto?.title || String(dto.title).trim().length < 2) {
      return "title is required";
    }

    if (dto.priority && !["low", "normal", "high", "urgent"].includes(dto.priority)) {
      return "invalid priority";
    }

    if (dto.maxRetries !== undefined) {
      const value = Number(dto.maxRetries);
      if (!Number.isFinite(value) || value < 0 || value > 20) return "invalid maxRetries";
    }

    return null;
  }
}
