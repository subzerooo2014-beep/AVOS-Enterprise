import { Injectable } from "@nestjs/common";
@Injectable()
export class UaePassProvider {
  login(state: string, redirectUri: string) {
    return {
      authorizationUrl:
        `https://sandbox.local/uae-pass/authorize?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`,
      state,
      simulated: true,
    };
  }
  callback(code: string, state: string) {
    return {
      userId: `uaepass_user_${Date.now()}`,
      code,
      state,
      authenticated: true,
      simulated: true,
    };
  }
}
