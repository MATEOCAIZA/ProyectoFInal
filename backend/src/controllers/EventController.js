import { EventService } from '../services/EventService.js';

const eventService = new EventService();

export class EventController {
  async createEvent(req, res) {
    try {
      const eventData = req.body;
      const event = await eventService.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const eventData = req.body;
      const updatedEvent = await eventService.updateEvent(eventData);
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { event_id } = req.params;
      await eventService.deleteEvent(event_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getEventsByTimeline(req, res) {
    try {
      const { timeline_id } = req.params;
      const events = await eventService.getEventsByTimelineId(timeline_id);
      res.status(200).json(events);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}
