const { Solicitud } = require('../models');
const { Op, fn, col } = require('sequelize');

// Reporte por día específico
exports.reportePorDia = async (req, res) => {
  const { fecha } = req.params;
  try {
    const reportes = await Solicitud.findAll({
      where: { fecha_visita: fecha },
      attributes: ['estado', [fn('COUNT', col('estado')), 'total']],
      group: ['estado']
    });
    res.json(reportes);
  } catch (err) {
    console.error("Error reporte por día:", err);
    res.status(500).json({ message: "Error al generar reporte por día" });
  }
};

// Reporte por mes
exports.reportePorMes = async (req, res) => {
  const { anio, mes } = req.params;
  try {
    const reportes = await Solicitud.findAll({
      where: {
        fecha_visita: {
          [Op.and]: [
            fn('EXTRACT', fn('YEAR', col('fecha_visita')), anio),
            fn('EXTRACT', fn('MONTH', col('fecha_visita')), mes)
          ]
        }
      },
      attributes: ['estado', [fn('COUNT', col('estado')), 'total']],
      group: ['estado']
    });
    res.json(reportes);
  } catch (err) {
    console.error("Error reporte por mes:", err);
    res.status(500).json({ message: "Error al generar reporte por mes" });
  }
};

// Reporte por rango
exports.reportePorRango = async (req, res) => {
  const { inicio, fin } = req.query;
  try {
    const reportes = await Solicitud.findAll({
      where: {
        fecha_visita: {
          [Op.between]: [inicio, fin]
        }
      },
      attributes: ['estado', [fn('COUNT', col('estado')), 'total']],
      group: ['estado']
    });
    res.json(reportes);
  } catch (err) {
    console.error("Error reporte por rango:", err);
    res.status(500).json({ message: "Error al generar reporte por rango" });
  }
};
