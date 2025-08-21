import { TimelineService } from '../services/TimelineService.js';
import { ProcessService } from '../services/ProcessService.js';

const timelineService = new TimelineService();
const processService = new ProcessService();

export class TimelineController {
  async createTimeline(req, res) {
    try {
      const timelineData = req.body;
      const account_id = req.user.id; 
      const timeline = await timelineService.createTimeline(timelineData, account_id);
      res.status(201).json(timeline);
    } catch (error) {
    if (error.message === 'No autorizado para crear timeline en este proceso') {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === 'Proceso no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
  }

  async addEvent(req, res) {
    try {
      const { timeline_id } = req.params;
      const { name, description } = req.body;
      const account_id = req.user.id;


      const event = await timelineService.addEvent({
      timeline_id,
      event_title: name,
      description,
      account_id: account_id,
    });

      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeEvent(req, res) {
    try {
      const { event_id } = req.params;
      const account_id = req.user.id;
      await timelineService.removeEvent(parseInt(event_id), account_id);
      res.status(200).json({ message: 'Eliminación de evento con éxito' });
    }  catch (error) {
    if (error.message === 'Evento no encontrado' || error.message === 'Timeline no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'No tienes permiso para eliminar este evento') {
      return res.status(403).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
  }


  async deleteTimeline(req, res) {
  try {
    const timeline_id = parseInt(req.params.timeline_id);
    const account_id = req.user.id;

    await timelineService.deleteTimeline(timeline_id, account_id);
    return res.status(204).json({ message: 'Timeline eliminado correctamente' });
  } catch (error) {
    if (error.message === 'Timeline no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'No tienes permiso para eliminar este timeline') {
      return res.status(403).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
}


  async modifyEvent(req, res) {
    try {
      const eventData = req.body;
      const account_id = req.user.id;

      const updatedEvent = await timelineService.modifyEvent(eventData, account_id);
      res.status(200).json(updatedEvent);
    } catch (error) {
    if (error.message === 'Evento no encontrado' || error.message === 'Timeline no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
  }

  async getTimelineByProcess(req, res) {
    try {
      const { process_id } = req.params;
      const account_id = req.user.id;
      // Validar que el proceso pertenece al usuario
      await processService.getProcessById(process_id, account_id);


      const timeline = await timelineService.getTimelineByProcessId(process_id);
      if (!timeline) {
      return res.status(404).json({ message: 'Timeline no encontrado' });
    }
      res.status(200).json(timeline);
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
}
