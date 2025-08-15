import { render, screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import UsersPage from "./UsersPage";
import { UsersService } from "./users";
import { AuthService } from "./AuthService"; // Asegúrate de importar AuthService

vi.mock("../api/users", () => ({
  UsersService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../api/AuthService", () => ({
  AuthService: {
    isAuthenticated: vi.fn(),
    getToken: vi.fn(),
  },
}));

const server = setupServer(
  http.get("/api/users", ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json([
      { id: "1", name: "Juan Pérez", email: "juan@example.com" },
      { id: "2", name: "María Gómez", email: "maria@example.com" },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

describe("UsersPage", () => {
  test("muestra lista de usuarios si está autenticado", async () => {
    (AuthService.isAuthenticated as vi.Mock).mockReturnValue(true);
    (UsersService.getAll as vi.Mock).mockResolvedValue([
      { id: "1", name: "Juan Pérez", email: "juan@example.com" },
      { id: "2", name: "María Gómez", email: "maria@example.com" },
    ]);

    render(<UsersPage />);

    expect(await screen.findByText("Juan Pérez — juan@example.com")).toBeInTheDocument();
    expect(await screen.findByText("María Gómez — maria@example.com")).toBeInTheDocument();
  });

  test("muestra 'No autorizado' si no hay token", async () => {
    (AuthService.isAuthenticated as vi.Mock).mockReturnValue(false);
    
    render(<UsersPage />);
    
    await waitFor(() => {
      expect(screen.getByText("No autorizado")).toBeInTheDocument();
    });
  });

  test("muestra spinner mientras carga", async () => {
    (AuthService.isAuthenticated as vi.Mock).mockReturnValue(true);
    (UsersService.getAll as vi.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<UsersPage />);
    
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("muestra mensaje de error cuando falla la carga", async () => {
    (AuthService.isAuthenticated as vi.Mock).mockReturnValue(true);
    (UsersService.getAll as vi.Mock).mockRejectedValue(new Error("Error"));

    render(<UsersPage />);
    
    expect(await screen.findByText("No se pudieron cargar los usuarios")).toBeInTheDocument();
  });
});