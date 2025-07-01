const pool = require("../db/connection");

// GET sitios asignados al guardaparque fijo (ID = 1)
exports.getSitiosAsignados = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sitios_turisticos WHERE id_guardaparque = 2"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener sitios asignados:", error);
    res.status(500).json({ message: "Error al obtener sitios asignados" });
  }
};

// PUT actualizar sitio (solo campos, sin cambiar id_guardaparque)
exports.actualizarSitio = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, aforo_maximo, estado } = req.body;

  try {
    const sitio = await pool.query(
      "SELECT * FROM sitios_turisticos WHERE id = $1 AND id_guardaparque = 2",
      [id]
    );

    if (sitio.rowCount === 0) {
      return res.status(403).json({ message: "No autorizado para este sitio" });
    }

    await pool.query(
      "UPDATE sitios_turisticos SET nombre=$1, descripcion=$2, aforo_maximo=$3, estado=$4 WHERE id=$5",
      [nombre, descripcion, aforo_maximo, estado, id]
    );

    res.json({ message: "Sitio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar sitio:", error);
    res.status(500).json({ message: "Error al actualizar sitio" });
  }
};

// GET listado público de todos los sitios
exports.getTodosLosSitios = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sitios_turisticos");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener sitios:", error);
    res.status(500).json({ message: "Error al obtener sitios" });
  }
};

// GET disponibilidad de un sitio en una fecha (ejemplo básico)
exports.getDisponibilidad = async (req, res) => {
  const { id, fecha } = req.params;

  try {
    // Este ejemplo asume que hay una tabla de reservas (no incluida en tu modelo)
    // De momento simplemente retorna el aforo del sitio
    const result = await pool.query("SELECT aforo_maximo FROM sitios_turisticos WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Sitio no encontrado" });
    }

    // Supongamos no hay reservas: aforo completo disponible
    res.json({ disponible: result.rows[0].aforo_maximo });
  } catch (error) {
    console.error("Error al consultar disponibilidad:", error);
    res.status(500).json({ message: "Error al consultar disponibilidad" });
  }
};

// GET un sitio por su ID (solo si pertenece al guardaparque ID 2)
exports.getSitioPorId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        "SELECT * FROM sitios_turisticos WHERE id = $1 AND id_guardaparque = 2",
        [id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Sitio no encontrado o no autorizado" });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error al obtener sitio:", error);
      res.status(500).json({ message: "Error al obtener sitio" });
    }
  };
  