import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ReservationsPage } from "./ReservationsPage";
import { ReservationsService } from "../api/reservations";
import { describe, test, expect, beforeEach, vi } from "vitest";

vi.mock("../api/reservations", () => ({
  ReservationsService: {
    getAll: vi.fn(),
  },
}));

describe("ReservationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("muestra estado de carga", () => {
    vi.mocked(ReservationsService.getAll).mockImplementation(
      () => new Promise(() => {}) // promesa que nunca resuelve
    );

    render(<ReservationsPage />);
    expect(screen.getByRole("status", { name: /Cargando/i })).toBeInTheDocument();
  });

  test("muestra lista de reservas cuando la carga es exitosa", async () => {
    vi.mocked(ReservationsService.getAll).mockResolvedValue([
      { id: "1", userId: "Juan", roomId: "101", status: "confirmada" },
      { id: "2", userId: "María", roomId: "202", status: "pendiente" },
    ]);

    render(<ReservationsPage />);

    expect(await screen.findByText(/Reservas/i)).toBeInTheDocument();
    expect(await screen.findByText(/Usuario: Juan \| Habitación: 101 \| Estado: confirmada/i)).toBeInTheDocument();
    expect(await screen.findByText(/Usuario: María \| Habitación: 202 \| Estado: pendiente/i)).toBeInTheDocument();
  });

  test("muestra mensaje de error y permite reintentar", async () => {
    const mockGetAll = vi.mocked(ReservationsService.getAll);
    mockGetAll.mockRejectedValueOnce(new Error("Error"));

    render(<ReservationsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No se pudieron cargar las reservas/i)).toBeInTheDocument();
    });

    // simula reintentar
    mockGetAll.mockResolvedValueOnce([
      { id: "3", userId: "Pedro", roomId: "303", status: "cancelada" },
    ]);

    fireEvent.click(screen.getByRole("button", { name: /Reintentar/i }));

    expect(await screen.findByText(/Usuario: Pedro \| Habitación: 303 \| Estado: cancelada/i)).toBeInTheDocument();
  });
});
