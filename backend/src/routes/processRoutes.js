import express from 'express';
import { ProcessController } from '../controllers/ProcessController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);
const processController = new ProcessController();

/**
 * @swagger
 * tags:
 *   name: Processes
 *   description: API para gestión de procesos legales
 */

// CRUD procesos
/**
 * @swagger
 * /processes:
 *   post:
 *     summary: Crear un nuevo proceso
 *     tags: [Processes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Proceso penal"
 *               type:
 *                 type: string
 *                 example: "Civil"
 *               offense:
 *                 type: string
 *                 example: "Robo"
 *               last_update:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T10:00:00Z"
 *               denounced:
 *                 type: string
 *                 example: "Juan Pérez"
 *               denouncer:
 *                 type: string
 *                 example: "María López"
 *               province:
 *                 type: string
 *                 example: "Buenos Aires"
 *               carton:
 *                 type: string
 *                 example: "Carton123"
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Proceso creado correctamente
 *         
 *       400:
 *         description: Datos inválidos
 */

router.post('/', processController.createProcess.bind(processController));

/**
 * @swagger
 * /processes/me:
 *   get:
 *     summary: Obtener todos los procesos del usuario autenticado
 *     tags: [Processes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de procesos encontrados
 *       401:
 *         description: No autorizado
 */
router.get('/me',  processController.getProcessesByAccountId.bind(processController)
);


/**
 * @swagger
 * /processes/{process_id}:
 *   get:
 *     summary: Obtener un proceso por ID
 *     tags: [Processes]
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
 *         description: Proceso encontrado
 *       404:
 *         description: Proceso no encontrado
 */
router.get( '/:process_id', processController.getProcessById.bind(processController)
);

/**
 * @swagger
 * /processes/{process_id}:
 *   delete:
 *     summary: Eliminar un proceso por ID (solo si pertenece al usuario autenticado)
 *     tags: [Processes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso a eliminar
 *     responses:
 *       204:
 *         description: Proceso eliminado correctamente (sin contenido)
 *       403:
 *         description: No autorizado para eliminar este proceso
 *       404:
 *         description: Proceso no encontrado
 *       400:
 *         description: Error de validación o de sintaxis
 */
router.delete('/:process_id',  processController.deleteProcess.bind(processController)
);








//Public
// Obtener todos o filtro por estado, fecha, nombre (Para el usuario general, no administrador, no abogado)
/**
 * @swagger
 * /processes:
 *   get:
 *     summary: Obtener todos los procesos o filtrar por estado, fecha o nombre
 *     tags: [Processes]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por estado del proceso
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filtrar por fecha de inicio
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por nombre/título del proceso
 *     responses:
 *       200:
 *         description: Lista de procesos
 */
router.get('/', processController.getAllProcesses.bind(processController));

/**
 * @swagger
 * /processes/{process_id}:
 *   put:
 *     summary: Actualizar un proceso por ID (solo si pertenece al usuario autenticado)
 *     tags: [Processes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Proceso penal"
 *               type:
 *                 type: string
 *                 example: "Civil"
 *               offense:
 *                 type: string
 *                 example: "Robo"
 *               last_update:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T10:00:00Z"
 *               denounced:
 *                 type: string
 *                 example: "Juan Pérez"
 *               denouncer:
 *                 type: string
 *                 example: "María López"
 *               province:
 *                 type: string
 *                 example: "Buenos Aires"
 *               carton:
 *                 type: string
 *                 example: "Carton123"
 *     responses:
 *       200:
 *         description: Proceso actualizado correctamente
 *       403:
 *         description: No autorizado para actualizar este proceso
 *       404:
 *         description: Proceso no encontrado
 *       400:
 *         description: Error de validación o sintaxis
 */
router.put('/:process_id', processController.updateProcess.bind(processController));




export default router;
