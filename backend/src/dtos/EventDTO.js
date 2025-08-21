export class EventDTO {
  constructor({ name, description, date, order, timeline_id }) {
    this.name = name;
    this.description = description;
    this.date = date;
    this.order = order;
    this.timeline_id = timeline_id;
  }
}
