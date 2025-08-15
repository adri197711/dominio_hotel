import { render, screen, waitFor } from "@testing-library/react";
import { UsersPage } from "./UsersPage";
import { AuthService, UsersService } from "../api/users";
import { describe, test, expect, beforeEach, vi } from "vitest";

vi.mock("../api/users", () => ({
  ...vi.importActual("../api/users"),
  AuthService: {
    isAuthenticated: vi.fn(),
  },
  UsersService: {
    getAll: vi.fn(),
  },
}));

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("muestra lista de usuarios si está autenticado", async () => {
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(true);
    vi.mocked(UsersService.getAll).mockResolvedValue([
      { id: "1", name: "Juan Pérez", email: "juan@example.com" },
      { id: "2", name: "María Gómez", email: "maria@example.com" },
    ]);

    render(<UsersPage />);

    expect(await screen.findByText("Juan Pérez — juan@example.com")).toBeInTheDocument();
    expect(await screen.findByText("María Gómez — maria@example.com")).toBeInTheDocument();
  });

  test("muestra 'No autorizado' si no está autenticado", async () => {
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(false);
    render(<UsersPage />);
    expect(screen.getByText(/No autorizado/i)).toBeInTheDocument();
  });

  test("muestra mensaje de error cuando falla la carga", async () => {
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(true);
    vi.mocked(UsersService.getAll).mockRejectedValue(new Error("Error de carga"));

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText("No se pudieron cargar los usuarios")).toBeInTheDocument();
    });
  });

  test("muestra estado de carga", async () => {
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(true);
    // Retrasamos la resolución de la promesa
    vi.mocked(UsersService.getAll).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 500))
    );

    render(<UsersPage />);
    
    expect(screen.findByText(/Cargando.../));
      expect(screen.queryByText(/Cargando.../)).not.toBeInTheDocument();
    });
  });