import pool from '../config/db.js';

export class EventRepository {
  async create(event) {
    const query = 'INSERT INTO event (name, description, date, "order", timeline_id) VALUES ($1,$2,$3,$4,$5) RETURNING *';
    const values = [event.name, event.description, event.date, event.order, event.timeline_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(event_id) {
    const query = 'SELECT * FROM event WHERE event_id = $1';
    const { rows } = await pool.query(query, [event_id]);
    return rows[0];
  }

  async update(event) {
    const query = 'UPDATE event SET name=$1, description=$2, date=$3, "order"=$4 WHERE event_id=$5 RETURNING *';
    const values = [event.name, event.description, event.date, event.order, event.event_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async updatePartial(event) {
  const query = `
    UPDATE event SET
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      date = COALESCE($3, date)
    WHERE event_id = $4
    RETURNING *;
  `;
  const values = [event.name, event.description, event.date, event.event_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}



  async delete(event_id) {
    const query = 'DELETE FROM event WHERE event_id=$1';
    await pool.query(query, [event_id]);
  }

  async reorderTimelineEvents(timeline_id) {
  const query = `
    SELECT event_id
    FROM event
    WHERE timeline_id = $1
    ORDER BY "order" ASC, event_id ASC`;
  const { rows } = await pool.query(query, [timeline_id]);

  for (let i = 0; i < rows.length; i++) {
    const updateQuery = 'UPDATE event SET "order" = $1 WHERE event_id = $2';
    await pool.query(updateQuery, [i + 1, rows[i].event_id]);
  }
}


  async findByTimelineId(timeline_id) {
    const query = 'SELECT * FROM event WHERE timeline_id = $1 ORDER BY "order"';
    const { rows } = await pool.query(query, [timeline_id]);
    return rows;
  }
}
