const request = require("supertest");
const app = require("../server");

describe("SolicitudesController", () => {
  test("crear solicitud - sin líder suficiente", async () => {
    const solicitud = {
      id_usuario: 1,
      id_sitio: 1,
      fecha_visita: "2025-07-30",
      participantes: [
        { nombre: "Juan", edad: 25, ci_pasaporte: "123", ciudad: "Quito", es_lider: false }
      ],
      contacto_emergencia: "0999999999",
      tipo_visitante: "familiar"
    };

    const res = await request(app).post("/api/solicitudes").send(solicitud);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/líder/);
  });
});