import { UNAUTHORIZED_PROFILE_RESPONSE } from "@/modules/auth/services/__mocks__/user.service.data";
import axiosInstance from "@/configs/interceptors";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
// import {  } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import * as AuthContext from "@/modules/auth/contexts/AuthContext";

import { MemoryRouter } from "react-router-dom";
import {
  INVALID_FORM_FIELD_VALUE,
  SIGN_UP_FORM_FIELDS,
  VALID_FORM_FIELD_VALUE,
} from "../__mocks__/authForm.data";
import { authContextMock } from "../../contexts/__mocks__/AuthContext.data";
import { SignUpForm } from "../SignUpForm";
import {
  REGISTER_FAILURE_RESPONSE,
  REGISTER_SUCCESS_RESPONSE,
} from "../../services/__mocks__/auth.service.data";

// Mock auth
vi.mock("@/modules/auth/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Signup Form component for SUCCESS response", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
      user: null,
    });
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.reject(UNAUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/auth/register") {
        return Promise.resolve(REGISTER_SUCCESS_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <SignUpForm />
        </MemoryRouter>
      );
    });
    expect(screen.getByText("Create account")).toBeTruthy();
  });

  test("should render error messages based on field validations", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <SignUpForm />
        </MemoryRouter>
      );
    });

    await waitFor(async () => {
      for (const field of SIGN_UP_FORM_FIELDS) {
        for (const value of INVALID_FORM_FIELD_VALUE[field.key]) {
          const inputField = screen.getByTestId(field.fieldTestId);
          for (const data of value.data) {
            if (field.key != "tnc") {
              fireEvent.change(inputField, { target: { value: data } });
            }
            screen.getByTestId("button-submit").click();
            await waitFor(() => {
              const errorLabel = screen.queryByTestId(field.errorTestId);
              expect(errorLabel?.textContent).equal(value.errorMessage);
            });
          }
        }
      }
    });
  });

  test("should display error message for confirmPassword if password is changed", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <SignUpForm />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      for (const field of SIGN_UP_FORM_FIELDS) {
        const inputField = screen.getByTestId(field.fieldTestId);
        if (field.key != "tnc") {
          fireEvent.change(inputField, {
            target: { value: VALID_FORM_FIELD_VALUE[field.key] },
          });
        }
      }
    });
    fireEvent.change(screen.getByTestId("field-password"), {
      target: { value: `${VALID_FORM_FIELD_VALUE["password"]}a` },
    });
    screen.getByTestId("button-submit").click();
    await waitFor(() => {
      const errorLabel = screen.getByTestId("errormsg-confirmpassword");
      expect(errorLabel.textContent).equal("Passwords do not match.");
    });
  });
  test("should verify no error message is displayed when successfully registered", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <SignUpForm />{" "}
        </MemoryRouter>
      );
    });
    await waitFor(() => {
      for (const field of SIGN_UP_FORM_FIELDS) {
        const inputField = screen.getByTestId(field.fieldTestId);
        if (field.key != "tnc") {
          fireEvent.change(inputField, {
            target: { value: VALID_FORM_FIELD_VALUE[field.key] },
          });
        } else {
          inputField.click();
        }
      }
    });
    screen.getByTestId("button-submit").click();
    await waitFor(() => {
      const errorLabel = screen.queryByTestId("sign-up-form-errors");
      expect(errorLabel).not.toBeInTheDocument();
    });
  });
});

describe("Signup Form component for FAILURE response", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
      user: null,
    });
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/auth/register") {
        return Promise.reject(REGISTER_FAILURE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("should display error message when register fails", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <SignUpForm />{" "}
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      for (const field of SIGN_UP_FORM_FIELDS) {
        const inputField = screen.getByTestId(field.fieldTestId);

        if (field.key != "tnc") {
          fireEvent.change(inputField, {
            target: { value: VALID_FORM_FIELD_VALUE[field.key] },
          });
        } else {
          inputField.click();
        }
      }
    });
    screen.getByTestId("button-submit").click();
    await waitFor(() => {
      const errorLabel = screen.getByTestId("sign-up-form-errors");
      expect(errorLabel).toBeInTheDocument();
    });
  });
});
