import express from 'express';
import accountRoutes from './accountRoutes.js';
import processRoutes from './processRoutes.js';
import timelineRoutes from './timelineRoutes.js';
import observationRoutes from './observationRoutes.js';


const router = express.Router();



/**
 * @swagger
 * tags:
 *   - name: Accounts
 *     description: Endpoints para gestión de cuentas de usuario
 *   - name: Processes
 *     description: Endpoints para la gestión de procesos legales
 *   - name: Timelines
 *     description: Endpoints para la gestión de líneas de tiempo
 *   - name: Observations
 *     description: Endpoints para la gestión de observaciones dentro de procesos
 */

router.use('/accounts', accountRoutes);
router.use('/processes', processRoutes);
router.use('/timelines', timelineRoutes);
router.use('/observations', observationRoutes);

export default router;
