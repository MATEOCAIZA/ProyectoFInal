import { ProcessService } from '../services/ProcessService.js';

const processService = new ProcessService();

export class ProcessController {
  async createProcess(req, res) {
    try {
      const processData = req.body;
      processData.account_id = req.user.id;

      // Validar todos los campos requeridos
      if (
        !processData.title ||
        !processData.type ||
        !processData.offense ||
        !processData.denounced ||
        !processData.denouncer ||
        !processData.province ||
        !processData.carton
      ) {
        return res
          .status(400)
          .json({ message: 'Todos los campos son obligatorios' });
      }

      // Expresión regular: solo letras (mayúsculas y minúsculas), espacios opcionales
      const onlyLettersRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;

      if (
        !onlyLettersRegex.test(processData.denounced) ||
        !onlyLettersRegex.test(processData.denouncer) ||
        !onlyLettersRegex.test(processData.province)
      ) {
        return res
          .status(400)
          .json({
            message:'Los campos denounced, denouncer y province solo deben contener letras y espacios',});
      }

      const newProcess = await processService.createProcess(processData);
      res.status(201).json(newProcess);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProcess(req, res) {
  try {
    const { process_id } = req.params;        // ID viene por URL
    const account_id = req.user.id;           // Usuario autenticado
    const updateData = req.body;

    // Validar que el proceso existe y pertenece al usuario
    await processService.getProcessById(process_id, account_id);

    // Agregar el process_id a los datos a actualizar para el repo
    updateData.process_id = Number(process_id);

    // Actualizar proceso
    const updatedProcess = await processService.updateProcess(updateData);

    res.status(200).json({
      message: 'Proceso actualizado correctamente',
      process: updatedProcess,
    });
  } catch (error) {
    if (error.message === 'Unauthorized access to this process') {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === 'Process not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}


async deleteProcess(req, res) {
  try {
    const { process_id } = req.params;
    const account_id = req.user.id;

    const process = await processService.getProcessById(process_id, account_id);

    // Verificar si existe el proceso y si pertenece al usuario autenticado
    if (!process || Number(process.account_id) !== Number(account_id)) {
      return res.status(403).json({ message: 'No autorizado para eliminar este proceso.' });
    }

    await processService.deleteProcess(process_id);
    res.status(204).json({ message: 'Proceso eliminado correctamente.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}




  async getProcessById(req, res) {
    try {
      const { process_id } = req.params;
      const account_id = req.user.id;

      const process = await processService.getProcessById(process_id, account_id);

      res.status(200).json(process);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }


async getProcessesByAccountId(req, res) {
  try {
    const account_id = req.user.id; 
    const processes = await processService.getProcessesByAccountId(account_id);
    res.status(200).json(processes); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


  

  async addEvent(req, res) {
    try {
      const { timeline_id } = req.params;
      const eventData = req.body;
      const event = await processService.addEvent(timeline_id, eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const eventData = req.body;
      const updatedEvent = await processService.updateEvent(eventData);
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeEvent(req, res) {
    try {
      const { event_id } = req.params;
      await processService.removeEvent(event_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addObservation(req, res) {
    try {
      const observationData = req.body;
      const observation = await processService.addObservation(observationData);
      res.status(201).json(observation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateObservation(req, res) {
    try {
      const observationData = req.body;
      const updatedObs = await processService.updateObservation(observationData);
      res.status(200).json(updatedObs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeObservation(req, res) {
    try {
      const { observation_id } = req.params;
      await processService.removeObservation(observation_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addEvidence(req, res) {
    try {
      const evidenceData = req.body;
      const evidence = await processService.addEvidence(evidenceData);
      res.status(201).json(evidence);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateEvidence(req, res) {
    try {
      const evidenceData = req.body;
      const updatedEvidence = await processService.updateEvidence(evidenceData);
      res.status(200).json(updatedEvidence);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeEvidence(req, res) {
    try {
      const { evidence_id } = req.params;
      await processService.removeEvidence(evidence_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addLegalAdvice(req, res) {
    try {
      const adviceData = req.body;
      const advice = await processService.addLegalAdvice(adviceData);
      res.status(201).json(advice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateLegalAdvice(req, res) {
    try {
      const adviceData = req.body;
      const updatedAdvice = await processService.updateLegalAdvice(adviceData);
      res.status(200).json(updatedAdvice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeLegalAdvice(req, res) {
    try {
      const { advice_id } = req.params;
      await processService.removeLegalAdvice(advice_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllProcesses(req, res) {
    try {
      const { status, date, name } = req.query;
      const processes = await processService.getAllProcesses(status, date, name);
      res.status(200).json(processes);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
