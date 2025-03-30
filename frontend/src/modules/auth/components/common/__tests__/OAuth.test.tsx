import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import OauthProvider from "../OAuth";
import { API_BASE_URL } from "@/configs/appConfig";

describe("OAuth component", () => {
  test("should verify google auth page is opened on click of Google button", () => {
    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(vi.fn());
    render(<OauthProvider />);
    screen.getByTestId("signin-google-auth").click();
    expect(windowOpenSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/auth/google`,
      "_self"
    );
  });
  test("should verify microsoft auth page is opened on click of Google button", () => {
    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(vi.fn());
    render(<OauthProvider />);
    screen.getByTestId("signin-ms-auth").click();
    expect(windowOpenSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/auth/microsoft`,
      "_self"
    );
  });
});
