import { Injectable } from "@nestjs/common";

@Injectable()
export class MockProviderService {
  success(payload: Record<string, unknown>) {
    return { success: true, providerReference: `mock_${Date.now()}`, payload };
  }
  failure(message = "mock failure") { throw new Error(message); }
}
