const express = require('express');
const router = express.Router();
const sitioController = require('../controllers/sitioController');
const authMiddleware = require('../middlewares/authMiddleware');
/**
 * @swagger
 * tags:
 *   name: Sitios
 *   description: Endpoints para gestión de sitios turísticos
 */

/**
 * @swagger
 * /sitios:
 *   get:
 *     summary: Obtener lista pública de sitios turísticos
 *     tags: [Sitios]
 *     responses:
 *       200:
 *         description: Lista de sitios turísticos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Parque Nacional"
 *                   descripcion:
 *                     type: string
 *                     example: "Lugar con naturaleza"
 *                   aforo_maximo:
 *                     type: integer
 *                     example: 100
 *                   estado:
 *                     type: string
 *                     example: "Abierto"
 */
router.get('/sitios', sitioController.getTodosLosSitios);
/**
 * @swagger
 * /sitios/{id}/disponibilidad/{fecha}:
 *   get:
 *     summary: Consultar disponibilidad de aforo de un sitio en una fecha
 *     tags: [Sitios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sitio turístico
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha a consultar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Aforo disponible en esa fecha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 disponible:
 *                   type: integer
 *                   example: 120
 *       404:
 *         description: Sitio no encontrado
 */
router.get('/sitios/:id/disponibilidad/:fecha', sitioController.getDisponibilidad);
/**
 * @swagger
 * /sitios/asignados:
 *   get:
 *     summary: Obtener todos los sitios asignados al único guardaparque (ID fijo = 1)
 *     tags: [Sitios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sitios asignados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   aforo_maximo:
 *                     type: integer
 *                   estado:
 *                     type: string
 *                   id_guardaparque:
 *                     type: integer
 *                     example: 1
 *       403:
 *         description: No autorizado o token inválido
 */
router.get('/sitios/asignados', authMiddleware, sitioController.getSitiosAsignados);
/**
 * @swagger
 * /sitios/{id}:
 *   put:
 *     summary: Actualizar un sitio turístico (asignado al único guardaparque)
 *     tags: [Sitios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del sitio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - aforo_maximo
 *               - estado
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Laguna Azul"
 *               descripcion:
 *                 type: string
 *                 example: "Sitio natural con afluencia media"
 *               aforo_maximo:
 *                 type: integer
 *                 example: 150
 *               estado:
 *                 type: string
 *                 example: "Cerrado temporalmente"
 *     responses:
 *       200:
 *         description: Sitio actualizado correctamente
 *       403:
 *         description: No autorizado (sitio no pertenece al guardaparque)
 *       404:
 *         description: Sitio no encontrado
 */
router.put('/sitios/:id', authMiddleware, sitioController.actualizarSitio);
/**
 * @swagger
 * /sitios/{id}:
 *   get:
 *     summary: Obtener los datos de un sitio turístico por ID (solo guardaparque ID 2)
 *     tags: [Sitios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sitio turístico
 *     responses:
 *       200:
 *         description: Datos del sitio turístico
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 nombre:
 *                   type: string
 *                   example: "Laguna de los Ilinizas"
 *                 descripcion:
 *                   type: string
 *                   example: "Hermosa laguna ubicada en la reserva"
 *                 aforo_maximo:
 *                   type: integer
 *                   example: 120
 *                 estado:
 *                   type: string
 *                   example: "Abierto"
 *                 id_guardaparque:
 *                   type: integer
 *                   example: 2
 *       404:
 *         description: Sitio no encontrado o no autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/sitios/:id', authMiddleware, sitioController.getSitioPorId);


module.exports = router;