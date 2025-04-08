import { UNAUTHORIZED_PROFILE_RESPONSE } from "@/modules/auth/services/__mocks__/user.service.data";
import axiosInstance from "@/configs/interceptors";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  LOGIN_FAILURE_RESPONSE,
  LOGIN_SUCCESS_RESPONSE,
} from "../../services/__mocks__/auth.service.data";
import { LoginForm } from "../LoginForm";
import {
  INVALID_FORM_FIELD_VALUE,
  LOGIN_FORM_FIELDS,
  VALID_FORM_FIELD_VALUE,
} from "../__mocks__/authForm.data";
import { AuthProvider } from "../../contexts/AuthContext";
import { Provider } from "react-redux";
import store from "@/store/store";
describe("Login Form component UI Validations", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.reject(UNAUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/auth/login") {
        return Promise.resolve(LOGIN_SUCCESS_RESPONSE);
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
        <Provider store={store}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </Provider>
      );
    });
    expect(screen.getByText("Sign in")).toBeTruthy();
  });

  test("should render error messages based on field validations", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </Provider>
      );
    });
    await waitFor(async () => {
      for (const field of LOGIN_FORM_FIELDS) {
        for (const value of INVALID_FORM_FIELD_VALUE[field.key]) {
          const inputField = screen.getByTestId(field.fieldTestId);
          for (const data of value.data) {
            fireEvent.change(inputField, { target: { value: data } });
            if ("verifyInScreen" in value && value.verifyInScreen) {
              const emailField = screen.getByTestId("field-email");
              fireEvent.change(emailField, {
                target: { value: VALID_FORM_FIELD_VALUE["email"] },
              });
            }
            screen.getByTestId("button-submit").click();
            await waitFor(() => {
              if ("verifyInScreen" in value && value.verifyInScreen) {
                expect(
                  screen.getByText(value.errorMessage)
                ).toBeInTheDocument();
              } else {
                const errorLabel = screen.queryByTestId(field.errorTestId);
                expect(errorLabel?.textContent).equal(value.errorMessage);
              }
            });
          }
        }
      }
    });
  });

  test("should render error message when invalid password is passed", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </Provider>
      );
    });
    await waitFor(() => {
      const emailInput = screen.getByTestId("field-email");
      fireEvent.change(emailInput, {
        target: { value: VALID_FORM_FIELD_VALUE["email"] },
      });
      INVALID_FORM_FIELD_VALUE["password"].forEach((value) => {
        const passwordInput = screen.getByTestId("field-password");
        fireEvent.change(passwordInput, { target: { value } });

        screen.getByTestId("button-submit").click();

        expect(screen.getByTestId(`sign-in-form-errors`)).toBeInTheDocument();
        expect(
          screen.getByText("Incorrect email or password.")
        ).toBeInTheDocument();
      });
    });
  });
  test("should verify no error message is displayed when successfully logged in", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </Provider>
      );
    });
    await waitFor(() => {
      // click submit button

      LOGIN_FORM_FIELDS.forEach((fieldName) => {
        const loginInput = screen.getByTestId(fieldName.fieldTestId);
        fireEvent.change(loginInput, {
          target: { value: VALID_FORM_FIELD_VALUE[fieldName.key] },
        });
      });

      screen.getByTestId("button-submit").click();
    });
    await waitFor(() => {
      LOGIN_FORM_FIELDS.forEach((fieldName) => {
        const errorLabel = screen.queryByTestId(fieldName.errorTestId);
        expect(errorLabel).not.toBeInTheDocument();
      });
    });
  });

  test("should verify email is populated if user has opted for rememberMe and logged in successfully", async () => {
    vi.spyOn(global.Storage.prototype, "getItem").mockImplementation((key) => {
      return key === "rememberedEmail" ? VALID_FORM_FIELD_VALUE["email"] : null;
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </Provider>
      );
    });
    await waitFor(() => {
      const emailInput = screen.getByTestId("field-email");
      expect(emailInput).toHaveValue(VALID_FORM_FIELD_VALUE["email"]);

      const rememberMeCheckbox = screen.getByTestId("field-rememberme");
      expect(rememberMeCheckbox).toHaveAttribute("data-state", "checked");
      const passwordInput = screen.getByTestId("field-password");
      fireEvent.change(passwordInput, {
        target: { value: VALID_FORM_FIELD_VALUE["loginPassword"] },
      });

      fireEvent.click(screen.getByTestId("button-submit"));
      expect(
        screen.queryByTestId(`sign-in-form-errors`)
      ).not.toBeInTheDocument();
    });
  });
});

describe("Login Form component FAILURE response", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.reject(UNAUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/auth/login") {
        return Promise.reject(LOGIN_FAILURE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("should verify error message is displayed when incorrect credential is entered", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </Provider>
      );
    });
    await waitFor(() => {
      // click submit button

      LOGIN_FORM_FIELDS.forEach((fieldName) => {
        const loginInput = screen.getByTestId(fieldName.fieldTestId);
        fireEvent.change(loginInput, {
          target: { value: VALID_FORM_FIELD_VALUE[fieldName.key] },
        });
      });

      screen.getByTestId("button-submit").click();
    });
    await waitFor(() => {
      expect(screen.getByTestId(`sign-in-form-errors`)).toBeInTheDocument();
      expect(
        screen.getByText("Incorrect email or password.")
      ).toBeInTheDocument();
    });
  });
});
