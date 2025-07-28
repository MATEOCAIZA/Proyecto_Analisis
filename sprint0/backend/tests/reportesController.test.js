const request = require("supertest");
const app = require("../server");

describe("ReportesController", () => {
  test("reporte por día - sin registros", async () => {
    const res = await request(app).get("/api/reportes/dia/1999-01-01");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});