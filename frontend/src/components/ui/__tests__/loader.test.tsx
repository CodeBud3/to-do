import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Loader from "../loader";

describe("Loader Component", () => {
  test("renders a loader component", () => {
    // TODO: Implement test
    render(<Loader />);
    expect(screen.getByTestId("button-loader")).toBeInTheDocument();
  });
});
