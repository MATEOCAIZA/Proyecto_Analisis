const { Solicitud, Participante, Usuario, Sitio } = require('../models');
const { Op } = require('sequelize');

exports.crearSolicitud = async (req, res) => {
  const { id_usuario, id_sitio, fecha_visita, participantes, contacto_emergencia, tipo_visitante } = req.body;

  try {
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

    const nuevaSolicitud = await Solicitud.create({
      id_usuario, id_sitio, fecha_visita, contacto_emergencia, tipo_visitante, estado: 'Pendiente'
    });

    const participantesConSolicitud = participantes.map(p => ({
      ...p,
      id_solicitud: nuevaSolicitud.id
    }));

    await Participante.bulkCreate(participantesConSolicitud);

    res.status(201).json({ message: "Solicitud creada correctamente", id: nuevaSolicitud.id });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ message: "Error interno al registrar la solicitud" });
  }
};

exports.getSolicitudesPorEstado = async (req, res) => {
  const { estado } = req.params;
  try {
    const solicitudes = await Solicitud.findAll({
      where: { estado },
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido'] },
        { model: Sitio, attributes: ['nombre'] }
      ]
    });

    // Transformar las solicitudes incluyendo nombre plano
    const datosFormateados = solicitudes.map(s => {
      const solicitud = s.toJSON();
      return {
        id: solicitud.id,
        fecha_visita: solicitud.fecha_visita,
        estado: solicitud.estado,
        nombre_usuario: solicitud.Usuario
          ? `${solicitud.Usuario.nombre} ${solicitud.Usuario.apellido}`
          : "Desconocido",
        nombre_sitio: solicitud.Sitio?.nombre || "Sitio"
      };
    });

    res.json(datosFormateados);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ message: "Error al consultar solicitudes" });
  }
};
exports.obtenerParticipantes = async (req, res) => {
  const { id } = req.params;

  try {
    const participantes = await Participante.findAll({
      where: { id_solicitud: id }
    });
    res.status(200).json(participantes);
  } catch (error) {
    console.error("Error al obtener participantes:", error);
    res.status(500).json({ message: "Error al obtener participantes" });
  }
};

exports.actualizarEstadoSolicitud = async (req, res) => {
  const { id } = req.params;
  const { estado, comentario_guardaparque } = req.body;

  if (!["Aceptada", "Rechazada"].includes(estado)) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  try {
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) return res.status(404).json({ message: "Solicitud no encontrada" });

    await solicitud.update({ estado, comentario_guardaparque: comentario_guardaparque || "" });
    res.status(200).json({ message: "Solicitud actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar estado de solicitud:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
