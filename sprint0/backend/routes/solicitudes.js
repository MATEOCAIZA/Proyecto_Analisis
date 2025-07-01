const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudesController');

/**
 * @swagger
 * tags:
 *   name: Solicitudes
 *   description: Gestión de solicitudes y participantes
 */

/**
 * @swagger
 * /solicitudes:
 *   post:
 *     summary: Crear una nueva solicitud
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *               id_sitio:
 *                 type: integer
 *                 example: 2
 *               fecha_visita:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-15"
 *               participantes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     edad:
 *                       type: integer
 *                     ci_pasaporte:
 *                       type: string
 *                     ciudad:
 *                       type: string
 *                     es_lider:
 *                       type: boolean
 *                     documento_consentimiento:
 *                       type: string
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente
 *       400:
 *         description: Error en validaciones
 *       500:
 *         description: Error interno
 */
router.post('/solicitudes', solicitudesController.crearSolicitud);

/**
 * @swagger
 * /solicitudes/{estado}:
 *   get:
 *     summary: Obtener solicitudes por estado
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *         example: Pendiente
 *     responses:
 *       200:
 *         description: Lista de solicitudes filtradas por estado
 *       500:
 *         description: Error interno
 */
router.get('/solicitudes/:estado', solicitudesController.getSolicitudesPorEstado);

/**
 * @swagger
 * /solicitudes/{id}:
 *   put:
 *     summary: Actualizar estado de la solicitud
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Aceptada, Rechazada]
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Solicitud actualizada
 *       500:
 *         description: Error interno
 */
router.put('/solicitudes/:id', solicitudesController.actualizarEstadoSolicitud);

module.exports = router;
