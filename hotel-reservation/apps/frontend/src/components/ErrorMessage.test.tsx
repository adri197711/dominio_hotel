import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorMessage } from "../components/ErrorMessage";
import { describe, test, expect, vi } from "vitest";

describe("ErrorMessage", () => {
  test("muestra el mensaje de error", () => {
    render(<ErrorMessage message="Algo salió mal" />);
    expect(screen.getByText("Algo salió mal")).toBeInTheDocument();
  });

  test("no muestra botón si no se pasa onRetry", () => {
    render(<ErrorMessage message="Error sin retry" />);
    expect(screen.queryByRole("button", { name: /Reintentar/i })).not.toBeInTheDocument();
  });

  test("muestra botón y ejecuta onRetry al hacer click", () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Error con retry" onRetry={onRetry} />);

    const button = screen.getByRole("button", { name: /Reintentar/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
