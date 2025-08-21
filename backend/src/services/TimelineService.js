import { TimelineRepository } from '../repositories/TimelineRepository.js';
import { EventRepository } from '../repositories/EventRepository.js';
import { ProcessRepository } from '../repositories/ProcessRepository.js';

const processRepo = new ProcessRepository();

const timelineRepo = new TimelineRepository();
const eventRepo = new EventRepository();

export class TimelineService {
  async createTimeline(timelineData, account_id) {
    // Verificar si el proceso existe y pertenece al usuario autenticado
    const process = await processRepo.findById(timelineData.process_id);
    if (!process) {
      throw new Error('Proceso no encontrado');
    }

    if (process.account_id !== account_id) {
    throw new Error('No autorizado para crear timeline en este proceso');
    }

      // Verificar si ya existe un timeline para ese proceso
    const existing = await timelineRepo.findById(timelineData.process_id);
    if (existing) {
      throw new Error('Ya existe un timeline para este proceso');
    }
    
    return await timelineRepo.create(timelineData);
  }

  async addEvent({timeline_id, event_title, description, account_id}) {

    //const timeline = await timelineRepo.findByProcessId(eventData.process_id);

    const timeline = await timelineRepo.findById(timeline_id);
    if (!timeline) {
      throw new Error('Timeline no encontrado');
    }

    const process = await processRepo.findById(timeline.process_id);
    if (!process || process.account_id !== account_id) {
      throw new Error('No tienes permiso para agregar eventos a este timeline');
    }

    const now = new Date();
    const order = timeline.number_events + 1;

    const event = await eventRepo.create({
        name: event_title,
        description,
        date: now,
        order,
        timeline_id
      });
    
     await timelineRepo.update({
        timeline_id,
        number_events: order
      });
    return event;
  }

  async modifyEvent(eventData, account_id) {
    const { event_id, event_title,  description } = eventData;

    // 1. Validar existencia del evento
    const existingEvent = await eventRepo.findById(event_id);
    if (!existingEvent) {
      throw new Error('Evento no encontrado');
    }

    // 2. Obtener timeline
    const timeline = await timelineRepo.findById(existingEvent.timeline_id);
    if (!timeline) {
      throw new Error('Timeline no encontrado');
    }

    // 3. Validar que el proceso pertenece al usuario autenticado
    const process = await processRepo.findById(timeline.process_id);
    if (!process || process.account_id !== account_id) {
      throw new Error('No tienes permiso para modificar este evento');
    }

    // 4. Ejecutar UPDATE con COALESCE (fecha actualizada si no se proporciona)
    const now = new Date();

    const updatedEvent = await eventRepo.updatePartial({
      event_id,
      name: event_title && event_title.trim() !== '' ? event_title : null,
     description: description && description.trim() !== '' ? description : null,
      date: now
    });

    return updatedEvent;
  }

  async getTimelineByProcessId(process_id) {
    return await timelineRepo.findByProcessId(process_id);
  }

  async removeEvent(event_id, account_id) {
    const existingEvent = await eventRepo.findById(event_id);
  if (!existingEvent) throw new Error('Evento no encontrado');

  const timeline = await timelineRepo.findById(existingEvent.timeline_id);
  if (!timeline) throw new Error('Timeline no encontrado');

  const process = await processRepo.findById(timeline.process_id);
  if (!process || process.account_id !== account_id) {
    throw new Error('No tienes permiso para eliminar este evento');
  }

  // Eliminar evento
  await eventRepo.delete(event_id);

  // Actualizar number_events
  await timelineRepo.decrementEventCount(timeline.timeline_id);

  // Reordenar los eventos que quedan (ajustar campo "order")
  await eventRepo.reorderTimelineEvents(timeline.timeline_id);
  }



  async deleteTimeline(timeline_id, account_id) {
  // 1. Validar existencia del timeline
  const timeline = await timelineRepo.findById(timeline_id);
  if (!timeline) {
    throw new Error('Timeline no encontrado');
  }

  // 2. Verificar propiedad del proceso
  const process = await processRepo.findById(timeline.process_id);
  if (!process || process.account_id !== account_id) {
    throw new Error('No tienes permiso para eliminar este timeline');
  }

  // 3. Eliminar el timeline
  await timelineRepo.deleteTimeline(timeline_id);
}

}
