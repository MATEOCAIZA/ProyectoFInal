import express from 'express';
import { TimelineController } from '../controllers/TimelineController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);
const timelineController = new TimelineController();


/**
 * @swagger
 * tags:
 *   name: Timelines
 *   description: API para gestión de timelines de procesos legales
 */


// Crear timeline para un proceso
/**
 * @swagger
 * /timelines:
 *   post:
 *     summary: Crear un nuevo timeline para un proceso
 *     tags: [Timelines]
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
 *             required:
 *               - process_id
 *     responses:
 *       201:
 *         description: Timeline creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', timelineController.createTimeline.bind(timelineController));

// Obtener timeline por process_id
/**
 * @swagger
 * /timelines/process/{process_id}:
 *   get:
 *     summary: Obtener timeline por ID de proceso
 *     tags: [Timelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso
 *     responses:
 *       200:
 *         description: Timeline encontrado
 *       403:
 *         description: No autorizado para ver este proceso
 *       404:
 *         description: Timeline no encontrado
 */
router.get('/process/:process_id', timelineController.getTimelineByProcess.bind(timelineController));

// Agregar evento a timeline, se modifica la tabla de eventos y de timelines
/**
 * @swagger
 * /timelines/{timeline_id}/event:
 *   post:
 *     summary: Agregar un evento a un timeline
 *     tags: [Timelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timeline_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del timeline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Título del evento
 *               description:
 *                 type: string
 *                 description: Descripción del evento (opcional)
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Evento agregado al timeline
 *       400:
 *         description: Datos inválidos
 */
router.post('/:timeline_id/event', timelineController.addEvent.bind(timelineController));


// Modificar evento
/**
 * @swagger
 * /timelines/event:
 *   put:
 *     summary: Modificar un evento en un timeline
 *     tags: [Timelines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: integer
 *               event_title:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - event_id
 *     responses:
 *       200:
 *         description: Evento modificado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Evento no encontrado
 */
router.put('/event', timelineController.modifyEvent.bind(timelineController));

// Remover evento
/**
 * @swagger
 * /timelines/event/{event_id}:
 *   delete:
 *     summary: Remover un evento de un timeline
 *     tags: [Timelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: event_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del evento a eliminar
 *     responses:
 *       204:
 *         description: Evento eliminado correctamente
 *       403:
 *         description: No tienes permiso para eliminar este evento
 *       404:
 *         description: Evento no encontrado
 *       400:
 *         description: Error al eliminar el evento
 */
router.delete('/event/:event_id', timelineController.removeEvent.bind(timelineController));

/**
 * @swagger
 * /timelines/{timeline_id}:
 *   delete:
 *     summary: Eliminar un timeline y todos sus eventos
 *     tags: [Timelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timeline_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del timeline a eliminar
 *     responses:
 *       204:
 *         description: Timeline eliminado correctamente
 *       403:
 *         description: No tienes permiso para eliminar este timeline
 *       404:
 *         description: Timeline no encontrado
 */
router.delete('/:timeline_id', timelineController.deleteTimeline.bind(timelineController));





export default router;
