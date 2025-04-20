import request from "supertest";

describe("POST /api/auth/register", () => {
  it("should fail for empty payload", async () => {
    const res = await request(global.__APP__)
      .post("/api/auth/register")
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
