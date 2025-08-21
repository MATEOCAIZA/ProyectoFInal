import express from 'express';
import { AccountController } from '../controllers/AccountController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
const accountController = new AccountController();

// Crear cuenta abogado - admin
/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Gestión de cuentas de usuario
 */

/**
 * @swagger
 * /accounts/create:
 *   post:
 *     summary: Crear una nueva cuenta
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, abogada, lector]
 *     responses:
 *       201:
 *         description: Cuenta creada correctamente
 *       400:
 *         description: Error de validación
 */
router.post('/create', accountController.register.bind(accountController));

// Login
/**
 * @swagger
 * /accounts/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', accountController.login.bind(accountController));

// Recuperar contraseña
/**
 * @swagger
 * /accounts/recover-password:
 *   post:
 *     summary: Recuperar contraseña
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Instrucciones de recuperación enviadas
 *       404:
 *         description: Correo no encontrado
 */
router.post('/recover-password', accountController.recoverPassword.bind(accountController));

// Modificar perfil
/**
 * @swagger
 * /accounts/profile:
 *   put:
 *     summary: Modificar información de cuenta y perfil del usuario autenticado
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ejemplo@dominio.com
 *               phone_number:
 *                 type: string
 *                 example: "+593987654321"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: nuevaContraseñaSegura123
 *               content:
 *                 type: string
 *                 example: "Soy abogada con experiencia en derecho civil."
 *     responses:
 *       200:
 *         description: Cuenta y/o perfil actualizado correctamente
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/profile', authenticateToken, accountController.modifyProfile.bind(accountController));



/**
 * @swagger
 * /accounts/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 account_id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 role:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *       401:
 *         description: Token no válido o no proporcionado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/profile', authenticateToken, accountController.getProfile.bind(accountController));


export default router;


