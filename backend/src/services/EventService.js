import { EventRepository } from '../repositories/EventRepository.js';

const eventRepo = new EventRepository();

export class EventService {
  async createEvent(eventData) {
    return await eventRepo.create(eventData);
  }

  async updateEvent(eventData) {
    return await eventRepo.update(eventData);
  }

  async deleteEvent(event_id) {
    return await eventRepo.delete(event_id);
  }

  async getEventsByTimelineId(timeline_id) {
    return await eventRepo.findByTimelineId(timeline_id);
  }
}
