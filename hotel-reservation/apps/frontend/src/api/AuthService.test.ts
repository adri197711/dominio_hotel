import { describe, test, expect } from "vitest";
import { AuthService } from "../api/users"; // 👈 mismo archivo donde lo exportaste

describe("AuthService", () => {
  test("isAuthenticated devuelve false por defecto", () => {
    expect(AuthService.isAuthenticated()).toBe(false);
  });


  test("getToken devuelve null por defecto", () => {
    expect(AuthService.getToken()).toBeNull();
  });

  });