import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

test("muestra el spinner correctamente", () => {
  render(<Spinner />);
  expect(screen.getByRole("status")).toBeInTheDocument();
});
