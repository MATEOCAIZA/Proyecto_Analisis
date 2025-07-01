const pool = require('../db/connection');

// Reporte por día específico
exports.reportePorDia = async (req, res) => {
  const { fecha } = req.params;

  try {
    const result = await pool.query(`
      SELECT estado, COUNT(*) as total
      FROM solicitudes
      WHERE fecha_visita = $1
      GROUP BY estado
    `, [fecha]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error reporte por día:", error);
    res.status(500).json({ message: "Error al generar reporte por día" });
  }
};

// Reporte por mes (yyyy-mm)
exports.reportePorMes = async (req, res) => {
  const { anio, mes } = req.params;

  try {
    const result = await pool.query(`
      SELECT estado, COUNT(*) as total
      FROM solicitudes
      WHERE EXTRACT(YEAR FROM fecha_visita) = $1
        AND EXTRACT(MONTH FROM fecha_visita) = $2
      GROUP BY estado
    `, [anio, mes]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error reporte por mes:", error);
    res.status(500).json({ message: "Error al generar reporte por mes" });
  }
};

// Reporte por rango de fechas
exports.reportePorRango = async (req, res) => {
  const { inicio, fin } = req.query;

  try {
    const result = await pool.query(`
      SELECT estado, COUNT(*) as total
      FROM solicitudes
      WHERE fecha_visita BETWEEN $1 AND $2
      GROUP BY estado
    `, [inicio, fin]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error reporte por rango:", error);
    res.status(500).json({ message: "Error al generar reporte por rango" });
  }
};
