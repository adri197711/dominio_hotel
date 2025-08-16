import { render, screen } from "@testing-library/react";
import { Spinner } from "../components/Spinner";
import { describe, test, expect } from "vitest";

describe("Spinner", () => {
  test("se renderiza con el rol 'status'", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  test("tiene el aria-label 'Cargando'", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status", { name: /Cargando/i });
    expect(spinner).toBeInTheDocument();
  });

  test("renderiza el círculo animado", () => {
    render(<Spinner />);
   const circle = screen.getByRole("status").firstElementChild;
    
    expect(circle).toHaveClass("animate-spin");
    expect(circle).toHaveClass("rounded-full");
  });
});
