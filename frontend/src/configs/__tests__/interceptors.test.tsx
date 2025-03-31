import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import axiosInstance from "../interceptors";
import "axios";

declare module "axios" {
  export interface AxiosInterceptorManager<V> {
    eject(id: number): void;
    handlers: any[];
  }
}
Object.defineProperty(window, "location", {
  value: {
    ...window.location,
    assign: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});
describe("Axios Interceptors", () => {
  beforeEach(() => {});

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should call request interceptor", async () => {
    await expect(
      axiosInstance.interceptors.request.handlers[0].fulfilled({
        data: "foo",
      })
    ).toStrictEqual({ data: "foo" });

    await expect(
      axiosInstance.interceptors.request.handlers[0].rejected({
        response: {
          statusText: "NotFound",
          status: 404,
          data: { message: "Page not found" },
        },
      })
    ).rejects.toMatchObject({
      response: {
        statusText: "NotFound",
        status: 404,
        data: { message: "Page not found" },
      },
    });
  });

  test("should call response interceptor", async () => {
    await expect(
      axiosInstance.interceptors.response.handlers[0].fulfilled({
        data: "foo",
      })
    ).toStrictEqual({ data: "foo" });

    await expect(
      axiosInstance.interceptors.response.handlers[0].rejected({
        response: {
          statusText: "NotFound",
          status: 404,
          data: { message: "Page not found" },
        },
      })
    ).rejects.toMatchObject({
      response: {
        statusText: "NotFound",
        status: 404,
        data: { message: "Page not found" },
      },
    });
  });

  test("should call response interceptor with 401", async () => {
    await expect(
      axiosInstance.interceptors.response.handlers[0].rejected({
        response: {
          statusText: "NotFound",
          status: 401,
          data: { message: "Page not found" },
        },
      })
    ).rejects.toMatchObject({
      response: {
        statusText: "NotFound",
        status: 401,
        data: { message: "Page not found" },
      },
    });
  });
});
