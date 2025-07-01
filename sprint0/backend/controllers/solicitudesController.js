const pool = require('../db/connection');

// POST: Crear una nueva solicitud con participantes
exports.crearSolicitud = async (req, res) => {
  const { id_usuario, id_sitio, fecha_visita, participantes } = req.body;

  try {
    // Validaciones:
    const total = participantes.length;
    const lideres = participantes.filter(p => p.es_lider).length;
    const menores = participantes.filter(p => p.edad < 18);

    if (lideres < Math.ceil(total / 4)) {
      return res.status(400).json({
        message: `Se requiere mínimo un líder por cada 4 personas. Faltan ${Math.ceil(total / 4) - lideres} líder(es).`
      });
    }

    const menoresSinDocumento = menores.filter(p => !p.documento_consentimiento);
    if (menoresSinDocumento.length > 0) {
      return res.status(400).json({
        message: "Todos los menores de edad deben adjuntar consentimiento firmado.",
        menores: menoresSinDocumento.map(p => p.nombre)
      });
    }

    // Crear solicitud
    const result = await pool.query(
      `INSERT INTO solicitudes (id_usuario, id_sitio, fecha_visita, estado)
       VALUES ($1, $2, $3, 'Pendiente') RETURNING id`,
      [id_usuario, id_sitio, fecha_visita]
    );

    const idSolicitud = result.rows[0].id;

    // Insertar participantes
    for (const p of participantes) {
      await pool.query(
        `INSERT INTO participantes 
          (id_solicitud, nombre, edad, ci_pasaporte, ciudad, es_lider, documento_consentimiento)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          idSolicitud,
          p.nombre,
          p.edad,
          p.ci_pasaporte,
          p.ciudad,
          p.es_lider || false,
          p.documento_consentimiento || null
        ]
      );
    }

    res.status(201).json({ message: "Solicitud creada correctamente", id: idSolicitud });

  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ message: "Error interno al registrar la solicitud" });
  }
};

// GET: Solicitudes por estado
exports.getSolicitudesPorEstado = async (req, res) => {
  const { estado } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.*, u.nombre AS nombre_usuario, st.nombre AS nombre_sitio
      FROM solicitudes s
      JOIN usuarios u ON s.id_usuario = u.id
      JOIN sitios_turisticos st ON s.id_sitio = st.id
      WHERE s.estado = $1
    `, [estado]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ message: "Error al consultar solicitudes" });
  }
};


// PUT: Actualizar estado de la solicitud (aceptar/rechazar)
exports.actualizarEstadoSolicitud = async (req, res) => {
  const { id } = req.params;
  const { estado, comentario } = req.body;

  try {
    await pool.query(`
      UPDATE solicitudes 
      SET estado = $1, comentario_guardaparque = $2
      WHERE id = $3
    `, [estado, comentario, id]);

    res.json({ message: "Solicitud actualizada" });
  } catch (error) {
    console.error("Error al actualizar solicitud:", error);
    res.status(500).json({ message: "Error al actualizar la solicitud" });
  }
};
