// src/api/RoomsService.test.ts
import { RoomsService } from "../api/rooms";
import { api } from "../api/axios";
import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("../api/axios", () => ({
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

describe("RoomsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getAll obtiene lista de habitaciones", async () => {
    (api.get as unknown as vi.Mock).mockResolvedValueOnce({
      data: [{ id: "1", number: "101", type: "single", pricePerNight: 100 }],
    });

    const result = await RoomsService.getAll();

    expect(result).toEqual([{ id: "1", number: "101", type: "single", pricePerNight: 100 }]);
    expect(api.get).toHaveBeenCalledWith("/rooms");
  });

  test("create envía habitación nueva", async () => {
    const newRoom = { number: "102", type: "double", pricePerNight: 200 };
    (api.post as unknown as vi.Mock).mockResolvedValueOnce({ data: { id: "2", ...newRoom } });

    const result = await RoomsService.create(newRoom);

    expect(result).toEqual({ id: "2", ...newRoom });
    expect(api.post).toHaveBeenCalledWith("/rooms", newRoom);
  });

  test("update modifica habitación", async () => {
    const updateData = { pricePerNight: 250 };
    (api.put as unknown as vi.Mock).mockResolvedValueOnce({
      data: { id: "2", number: "102", type: "double", pricePerNight: 250 },
    });

    const result = await RoomsService.update("2", updateData);

    expect(result.pricePerNight).toBe(250);
    expect(api.put).toHaveBeenCalledWith("/rooms/2", updateData);
  });

  test("delete elimina habitación", async () => {
    (api.delete as unknown as vi.Mock).mockResolvedValueOnce({});

    await RoomsService.delete("2");

    expect(api.delete).toHaveBeenCalledWith("/rooms/2");
  });
});
