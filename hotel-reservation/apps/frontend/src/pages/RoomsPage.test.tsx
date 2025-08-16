import { render, screen } from "@testing-library/react";
import { RoomsPage } from "./RoomsPage";
import { RoomsService } from "../api/rooms";
import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("../api/rooms", () => ({
  RoomsService: {
    getAll: vi.fn(),
  },
}));

describe("RoomsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("muestra lista de habitaciones cuando la carga es exitosa", async () => {
    vi.mocked(RoomsService.getAll).mockResolvedValue([
      { id: "1", number: 101, type: "Single", pricePerNight: 100, status: "Available" },
      { id: "2", number: 202, type: "Double", pricePerNight: 200, status: "Occupied" },
    ]);

    render(<RoomsPage />);

    expect(await screen.findByText(/Habitaciones/i)).toBeInTheDocument();
    expect(await screen.findByText("Room 101"));
    expect(await screen.findByText("Room 202"));
  });

  test("muestra mensaje de error y permite reintentar", async () => {
    vi.mocked(RoomsService.getAll).mockRejectedValue(new Error("Error de carga"));

    render(<RoomsPage />);

    expect(await screen.findByText("No se pudieron cargar las habitaciones")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reintentar/i })).toBeInTheDocument();
  });
});
