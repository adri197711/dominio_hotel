import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
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
    expect(await screen.findByText("Room 101")).toBeInTheDocument();
    expect(await screen.findByText("Room 202")).toBeInTheDocument();
  });

  test("muestra mensaje de error y permite reintentar", async () => {
    vi.mocked(RoomsService.getAll).mockRejectedValue(new Error("Error de carga"));

    render(<RoomsPage />);

    expect(await screen.findByText("No se pudieron cargar las habitaciones")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reintentar/i })).toBeInTheDocument();
  });

  test("muestra un estado de carga mientras se obtienen los datos", async () => {
    vi.mocked(RoomsService.getAll).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    render(<RoomsPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("status")).not.toBeInTheDocument();
    });
  });

  test("muestra un mensaje cuando no hay habitaciones disponibles", async () => {
    vi.mocked(RoomsService.getAll).mockResolvedValue([]);

    render(<RoomsPage />);

    expect(await screen.findByText(/No hay habitaciones disponibles/i)).toBeInTheDocument();
  });

  test("el botón de reintentar vuelve a llamar al servicio y muestra datos", async () => {
    const user = userEvent.setup();

    vi.mocked(RoomsService.getAll)
      .mockRejectedValueOnce(new Error("Error inicial"))
      .mockResolvedValueOnce([
        { id: "1", number: 101, type: "Single", pricePerNight: 100, status: "Available" },
      ]);

    render(<RoomsPage />);

    const retryButton = await screen.findByRole("button", { name: /Reintentar/i });

    expect(RoomsService.getAll).toBeCalledTimes(1);
    await user.click(retryButton);
    expect(await screen.findByText("Room 101")).toBeInTheDocument();
    expect(RoomsService.getAll).toHaveBeenCalledTimes(2);
  });
});

// import { render, screen } from "@testing-library/react";
// import { RoomsPage } from "./RoomsPage";
// import { RoomsService } from "../api/rooms";
// import { vi, describe, test, expect, beforeEach } from "vitest";

// vi.mock("../api/rooms", () => ({
//   RoomsService: {
//     getAll: vi.fn(),
//   },
// }));

// describe("RoomsPage", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   test("muestra lista de habitaciones cuando la carga es exitosa", async () => {
//     vi.mocked(RoomsService.getAll).mockResolvedValue([
//       { id: "1", number: 101, type: "Single", pricePerNight: 100, status: "Available" },
//       { id: "2", number: 202, type: "Double", pricePerNight: 200, status: "Occupied" },
//     ]);

//     render(<RoomsPage />);

//     expect(await screen.findByText(/Habitaciones/i)).toBeInTheDocument();
//     expect(await screen.findByText("Room 101")).toBeInTheDocument();
//     expect(await screen.findByText("Room 202")).toBeInTheDocument();
//   });

//   test("muestra mensaje de error y permite reintentar", async () => {
//     vi.mocked(RoomsService.getAll).mockRejectedValue(new Error("Error de carga"));

//     render(<RoomsPage />);

//     expect(await screen.findByText("No se pudieron cargar las habitaciones")).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /Reintentar/i })).toBeInTheDocument();
//   });
// });
