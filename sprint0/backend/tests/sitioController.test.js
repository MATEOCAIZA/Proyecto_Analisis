const request = require("supertest");
const app = require("../server");

describe("SitioController", () => {
  test("consultar sitio inexistente - token inválido", async () => {
    const res = await request(app)
      .get("/api/sitios/999")
      .set("Authorization", "Bearer tokeninvalido");

    expect(res.statusCode).toBe(403);
  });
});