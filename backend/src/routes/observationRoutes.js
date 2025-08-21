import express from 'express';
import { ObservationController } from '../controllers/ObservationController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
//router.use(authenticateToken);
const observationController = new ObservationController();

/**
 * @swagger
 * tags:
 *   name: Observations
 *   description: API para gestión de observaciones
 */

// CRUD observaciones


/**
 * @swagger
 * /observations:
 *   post:
 *     summary: Crear una nueva observación
 *     tags: [Observations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               process_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - process_id
 *               - content
 *     responses:
 *      201:
 *         description: Observación creada correctamente
 *      400:
 *         description: Datos inválidos
 *      403:
 *         description: No tienes permiso para agregar observaciones a este proceso
 *      404:
 *         description: Proceso no encontrado
 */
router.post('/', authenticateToken, observationController.addObservation.bind(observationController));



/**
 * @swagger
 * /observations/process/{process_id}:
 *   get:
 *     summary: Obtener observaciones por ID de proceso (Publico)
 *     tags: [Observations]
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso legal
 *     responses:
 *       200:
 *         description: Lista de observaciones para el proceso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   observation_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Observación importante"
 *                   content:
 *                     type: string
 *                     example: "Detalle de la observación..."
 *                   process_id:
 *                     type: integer
 *                     example: 9
 *       404:
 *         description: Proceso no encontrado o no hay observaciones para el proceso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se encontraron observaciones para el proceso"
 */
router.get('/process/:process_id', observationController.getObservationsByProcess.bind(observationController));

/**
 * @swagger
 * /observations:
 *   put:
 *     summary: Modificar una observación existente (solo si es dueño del proceso)
 *     tags: [Observations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observation_id:
 *                 type: integer
 *                 example: 4
 *               title:
 *                 type: string
 *                 nullable: true
 *                 example: "Nuevo título de observación"
 *               content:
 *                 type: string
 *                 nullable: true
 *                 example: "Texto actualizado de la observación"
 *             required:
 *               - observation_id
 *     responses:
 *       200:
 *         description: Observación modificada correctamente
 *       400:
 *         description: Datos inválidos o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No autorizado para modificar esta observación"
 */

router.put('/', authenticateToken,observationController.modifyObservation.bind(observationController));


/**
 * @swagger
 * /observations/{observation_id}:
 *   delete:
 *     summary: Eliminar una observación por ID
 *     tags: [Observations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: observation_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la observación a eliminar
 *     responses:
 *       200:
 *         description: Observación eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Observación eliminada correctamente
 *       400:
 *         description: Error en la solicitud
 *       403:
 *         description: No autorizado para eliminar esta observación
 *       404:
 *         description: No se encontró la observación
 */
router.delete('/:observation_id', authenticateToken,observationController.deleteObservation.bind(observationController));

export default router;
