import { ObservationService } from '../services/ObservationService.js';
import { ProcessService } from '../services/ProcessService.js';

const observationService = new ObservationService();
const processService = new ProcessService();

export class ObservationController {
  async addObservation(req, res) {
    try {
      const { process_id, title, content } = req.body;
      const account_id = req.user.id;

      if (!process_id || !title || !content) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
      }

      const processExists = await processService.existsById(process_id);
      if (!processExists) {
        return res.status(404).json({ message: 'Proceso no encontrado' });
      }

      const observation = await observationService.createObservation(
        { process_id, title, content },
        account_id
      );

      return res.status(201).json(observation);
    } catch (error) {
      if (['Proceso no encontrado', 'No autorizado'].includes(error.message)) {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error al crear la observación' });
    }
  }

  async modifyObservation(req, res) {
    try {
      const { observation_id, title, content } = req.body;
      const account_id = req.user.id;

      if (!observation_id || !title || !content) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
      }

      const updatedObservation = await observationService.modifyObservation({
        observation_id,
        title,
        content,
        account_id,
      });

      return res.status(200).json(updatedObservation);
    } catch (error) {
      if (error.message === 'Observación no encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'No autorizado') {
        return res.status(403).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: 'Error al modificar la observación' });
    }
  }

  async deleteObservation(req, res) {
    try {
      const { observation_id } = req.params;
      const account_id = req.user.id;

      if (!observation_id) {
        return res.status(400).json({ message: 'Falta observation_id' });
      }

      await observationService.deleteObservation({
        observation_id,
        account_id,
      });

      return res.status(204).send(); // sin contenido
    } catch (error) {
      if (error.message === 'Observación no encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'No autorizado') {
        return res.status(403).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: 'Error al eliminar la observación' });
    }
  }

  async getObservationsByProcess(req, res) {
    try {
      const { process_id } = req.params;

      if (!process_id) {
        return res.status(400).json({ message: 'Falta process_id' });
      }

      const processExists = await processService.existsById(process_id);
      if (!processExists) {
        return res.status(404).json({ message: 'Proceso no encontrado' });
      }

      const observations = await observationService.getObservationsByProcessId(
        process_id
      );

      return res.status(200).json(observations); // Lista vacía está bien para 200
    } catch {
      return res
        .status(500)
        .json({ message: 'Error al obtener las observaciones' });
    }
  }

}

