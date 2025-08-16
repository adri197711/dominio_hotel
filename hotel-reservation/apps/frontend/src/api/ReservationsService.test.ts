// src/api/ReservationsService.test.ts
import { ReservationsService } from "./reservations";
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
      response: { use: vi.fn() },
    },
  },
}));

describe("ReservationsService", () => {
  test("getAll llama a api.get y retorna reservas", async () => {
    (api.get as unknown as vi.Mock).mockResolvedValue({
      data: [{ id: "1", userId: "1", roomId: "101", status: "confirmed" }],
    });

    const result = await ReservationsService.getAll();

    expect(api.get).toHaveBeenCalledWith("/reservations");
    expect(result).toEqual([{ id: "1", userId: "1", roomId: "101", status: "confirmed" }]);
  });
});
