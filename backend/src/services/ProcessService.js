import { ProcessRepository } from '../repositories/ProcessRepository.js';
import { TimelineRepository } from '../repositories/TimelineRepository.js';
import { EventRepository } from '../repositories/EventRepository.js';
import { ObservationRepository } from '../repositories/ObservationRepository.js';

const processRepo = new ProcessRepository();
const timelineRepo = new TimelineRepository();
const eventRepo = new EventRepository();
const observationRepo = new ObservationRepository();

export class ProcessService {
  async createProcess(processData) {
    const process = await processRepo.create(processData);
    await timelineRepo.create({ process_id: process.process_id, number_events: 0 });
    return process;
  }

  async updateProcess(processData) {
    return await processRepo.update(processData);
  }

  async deleteProcess(process_id) {
    return await processRepo.delete(process_id);
  }


async getProcessesByAccountId(account_id) {
  return await processRepo.findByAccountId(account_id);
}


  async getProcessById(process_id, account_id) {
    const process = await processRepo.findById(process_id);
    if (!process) throw new Error('Process not found');

    if (process.account_id !== account_id) {
      throw new Error('Unauthorized access to this process');
    }

    const timeline = await timelineRepo.findByProcessId(process_id);
    const events = await eventRepo.findByTimelineId(timeline.timeline_id);
    const observations = await observationRepo.findByProcessId(process_id);
   

    return {
      ...process,
      timeline,
      events,
      observations,
    };
  }

  async getAllProcesses(filters = {}) {
    const { status, startDate, endDate, name } = filters;
    return await processRepo.findAll({ status, startDate, endDate, name });
  }

  // Métodos para manejar eventos dentro de la timeline
  async addEvent(timeline_id, eventData) {
    const event = await eventRepo.create({ ...eventData, timeline_id });
    // Actualizar número de eventos en timeline
    const timeline = await timelineRepo.findByProcessId(eventData.process_id);
    await timelineRepo.update({ timeline_id: timeline.timeline_id, number_events: timeline.number_events + 1 });
    return event;
  }

  async updateEvent(eventData) {
    return await eventRepo.update(eventData);
  }

  async removeEvent(event_id) {
    return await eventRepo.delete(event_id);
  }

  // Métodos para observaciones
  async addObservation(observation) {
    return await observationRepo.create(observation);
  }

  async updateObservation(observation) {
    return await observationRepo.update(observation);
  }

  async removeObservation(observation_id) {
    return await observationRepo.delete(observation_id);
  }

  async existsById(process_id) {
  const process = await processRepo.findById(process_id);
  return !!process;
}

 

 
}
