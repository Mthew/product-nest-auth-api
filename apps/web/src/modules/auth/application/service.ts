import { httpManager } from "@/lib/httpManager";
import { LoginCredentials } from "../domain/entities";

export interface AuthResponse {
  role: string;
  token: string;
}

class AuthService {
  login(credentials: LoginCredentials) {
    return httpManager.post("/auth/login", credentials);
  }

  logout() {
    return httpManager.post("/auth/logout");
  }
}

export const authService = new AuthService();
