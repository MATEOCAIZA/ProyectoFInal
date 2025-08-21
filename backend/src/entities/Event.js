export class Event {
  constructor({ event_id, name, description, date, order, timeline_id }) {
    this.event_id = event_id;
    this.name = name;
    this.description = description;
    this.date = date;
    this.order = order;
    this.timeline_id = timeline_id;
  }
}
