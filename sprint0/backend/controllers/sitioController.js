const { Sitio } = require("../models");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// GET sitios asignados al guardaparque ID 2
exports.getSitiosAsignados = async (req, res) => {
  try {
    const sitios = await Sitio.findAll({ where: { id_guardaparque: 2 } });
    res.json(sitios);
  } catch (error) {
    console.error("Error al obtener sitios asignados:", error);
    res.status(500).json({ message: "Error al obtener sitios asignados" });
  }
};

// PUT actualizar un sitio turístico
exports.actualizarSitio = async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, aforo_maximo, estado } = req.body;

  try {
    const sitio = await Sitio.findByPk(id);
    if (!sitio) return res.status(404).json({ message: "Sitio no encontrado" });

    await sitio.update({
      nombre: nombre || sitio.nombre,
      descripcion: descripcion || sitio.descripcion,
      aforo_maximo: aforo_maximo ?? sitio.aforo_maximo,
      estado: estado || sitio.estado
    });

    res.status(200).json({ message: "Sitio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar sitio:", error);
    res.status(500).json({ message: "Error interno al actualizar sitio" });
  }
};

// GET todos los sitios (público)
exports.getTodosLosSitios = async (req, res) => {
  try {
    const sitios = await Sitio.findAll();
    res.json(sitios);
  } catch (error) {
    console.error("Error al obtener sitios:", error);
    res.status(500).json({ message: "Error al obtener sitios" });
  }
};

// GET disponibilidad por fecha (simulada)
exports.getDisponibilidad = async (req, res) => {
  const { id } = req.params;
  try {
    const sitio = await Sitio.findByPk(id);
    if (!sitio) return res.status(404).json({ message: "Sitio no encontrado" });

    res.json({ disponible: sitio.aforo_maximo });
  } catch (error) {
    console.error("Error al consultar disponibilidad:", error);
    res.status(500).json({ message: "Error al consultar disponibilidad" });
  }
};

// GET un sitio por ID y validación de guardaparque
exports.getSitioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const sitio = await Sitio.findOne({
      where: { id, id_guardaparque: 2 }
    });

    if (!sitio) return res.status(404).json({ message: "Sitio no encontrado o no autorizado" });
    res.json(sitio);
  } catch (error) {
    console.error("Error al obtener sitio:", error);
    res.status(500).json({ message: "Error al obtener sitio" });
  }
};

// ====================
// Cargar imágenes con multer
// ====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../public/uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E6)}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

exports.subirImagenes = [
  upload.array('imagenes', 5),
  async (req, res) => {
    const sitioId = req.params.id;
    const rutas = req.files.map(file => `/uploads/${file.filename}`);

    try {
      const sitio = await Sitio.findByPk(sitioId);
      if (!sitio) return res.status(404).json({ message: "Sitio no encontrado" });

      const imagenesPrevias = sitio.imagenes || [];
      const nuevasImagenes = [...imagenesPrevias, ...rutas];

      await sitio.update({ imagenes: nuevasImagenes });

      res.status(200).json({ message: "Imágenes subidas correctamente", rutas });
    } catch (error) {
      console.error("Error al guardar imágenes:", error);
      res.status(500).json({ error: "Error al guardar imágenes" });
    }
  }
];
