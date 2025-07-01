const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

/**
 * @swagger
 * /registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - nombre
 *               - apellido
 *               - ci_pasaporte
 *               - nacionalidad
 *               - correo
 *               - contacto
 *               - contrasena
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: "maria.ecu"
 *               nombre:
 *                 type: string
 *                 example: "María"
 *               apellido:
 *                 type: string
 *                 example: "Velásquez"
 *               ci_pasaporte:
 *                 type: string
 *                 example: "1728394850"
 *               nacionalidad:
 *                 type: string
 *                 example: "Ecuatoriana"
 *               correo:
 *                 type: string
 *                 example: "maria@correo.com"
 *               contacto:
 *                 type: string
 *                 example: "0999999999"
 *               contrasena:
 *                 type: string
 *                 example: "claveSegura123"
 *               rol:
 *                 type: string
 *                 enum: [visitante, guardaparque]
 *                 example: "visitante"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error en el servidor
 */
router.post('/registro', authController.registro);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasena
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: "maria.ecu"
 *               contrasena:
 *                 type: string
 *                 example: "claveSegura123"
 *     responses:
 *       200:
 *         description: Login exitoso con token JWT y rol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                 rol:
 *                   type: string
 *                   example: "guardaparque"
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     apellido:
 *                       type: string
 *                     rol:
 *                       type: string
 *       401:
 *         description: Usuario no encontrado
 *       403:
 *         description: Contraseña incorrecta
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', authController.login);

module.exports = router;
