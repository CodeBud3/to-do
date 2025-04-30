import request from "supertest";
import { authValidationFailureData } from "./__mocks__/auth.data";

describe("POST /api/auth/register", () => {
  it("should fail for invalid payload", async () => {
    for (const authData of authValidationFailureData) {
      const res = await request(global.__APP__)
        .post("/api/auth/register")
        .send(authData.data);
      expect(res.statusCode).toBe(400);
      expect(res.body).toBeTruthy();
      expect(res.body.error.code).toEqual("VALIDATION_ERROR");
      expect(res.body.error.details).toBeTruthy();
      for (
        let index = 0;
        index < res.body?.error?.details?.length;
        index += 1
      ) {
        const errorDetail = res.body.error.details[index];
        const [body, errorField] = errorDetail.path;
        expect(errorField).toEqual(authData.expectedErrorMessage[index].path);
        expect(errorDetail.message).toEqual(
          authData.expectedErrorMessage[index].message
        );
      }
    }
  });
});
