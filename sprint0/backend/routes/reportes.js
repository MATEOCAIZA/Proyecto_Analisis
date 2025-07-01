const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Endpoints para generar reportes de solicitudes
 */

/**
 * @swagger
 * /api/reportes/dia/{fecha}:
 *   get:
 *     summary: Generar reporte por fecha específica
 *     tags: [Reportes]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-07-15"
 *     responses:
 *       200:
 *         description: Reporte generado
 *       500:
 *         description: Error interno
 */
router.get('/reportes/dia/:fecha', reportesController.reportePorDia);

/**
 * @swagger
 * /api/reportes/mes/{anio}/{mes}:
 *   get:
 *     summary: Generar reporte por mes
 *     tags: [Reportes]
 *     parameters:
 *       - in: path
 *         name: anio
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2025
 *       - in: path
 *         name: mes
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Reporte generado
 *       500:
 *         description: Error interno
 */
router.get('/reportes/mes/:anio/:mes', reportesController.reportePorMes);

/**
 * @swagger
 * /api/reportes/rango:
 *   get:
 *     summary: Generar reporte por rango de fechas
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: inicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-07-01"
 *       - in: query
 *         name: fin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-07-30"
 *     responses:
 *       200:
 *         description: Reporte generado
 *       500:
 *         description: Error interno
 */
router.get('/reportes/rango', reportesController.reportePorRango);

module.exports = router;
