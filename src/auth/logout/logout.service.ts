import { Injectable } from "@nestjs/common";

@Injectable()
export class LogoutService {

  logout() {
    return {
      success: true,
      message: "Logged out successfully",
    };
  }

}
