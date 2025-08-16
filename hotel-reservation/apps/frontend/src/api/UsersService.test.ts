// src/api/UsersService.test.ts
import { UsersService } from "./users";
import { api } from "./axios";
import { vi, describe, test, expect } from "vitest";

vi.mock("./axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { 
      request: { use: vi.fn() }, 
      response: { use: vi.fn() } 
    },
  },
}));

describe("UsersService", () => {
  test("getAll llama a api.get y retorna usuarios", async () => {
    (api.get as unknown as vi.Mock).mockResolvedValue({ data: [{ id: "1", name: "Juan" }] });
    
    const result = await UsersService.getAll();
    
    expect(api.get).toHaveBeenCalledWith("/users");
    expect(result).toEqual([{ id: "1", name: "Juan" }]);
  });
});
