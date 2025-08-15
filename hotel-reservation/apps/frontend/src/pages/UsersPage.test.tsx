import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from 'msw'
import { setupServer } from "msw/node";
import { UsersPage } from "./UsersPage";

const server = setupServer(
  http.get("/users", () => { // Changed from /api/users to /users
    return HttpResponse.json([
      { id: "1", name: "Juan Pérez", email: "juan@example.com" },
      { id: "2", name: "María Gómez", email: "maria@example.com" },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("carga y muestra usuarios correctamente", async () => {
  render(<UsersPage />);

  // Use findByText to wait for the elements to appear
  const juan = await screen.findByText("juan@example.com");
  const maria = await screen.findByText("maria@example.com");
  
  expect(juan).toBeInTheDocument();
  expect(maria).toBeInTheDocument();
});