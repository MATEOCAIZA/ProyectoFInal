import pool from '../config/db.js';

export class TimelineRepository {
  async create(timeline) {
    const query = 'INSERT INTO timeline (number_events, process_id) VALUES ($1, $2) RETURNING *';
    const values = [timeline.number_events, timeline.process_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByProcessId(process_id) {
    const query = 'SELECT * FROM timeline WHERE process_id = $1';
    const { rows } = await pool.query(query, [process_id]);
    return rows[0];
  }

  async findById(timeline_id) {
    const query = 'SELECT * FROM timeline WHERE timeline_id = $1';
    const { rows } = await pool.query(query, [timeline_id]);
    return rows[0];
  }

  async decrementEventCount(timeline_id) {
  const query = 'UPDATE timeline SET number_events = number_events - 1 WHERE timeline_id = $1';
  await pool.query(query, [timeline_id]);
  }


  async update(timeline) {
    const query = 'UPDATE timeline SET number_events = $1 WHERE timeline_id = $2 RETURNING *';
    const values = [timeline.number_events, timeline.timeline_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(timeline_id) {
    const query = 'DELETE FROM timeline WHERE timeline_id = $1';
    await pool.query(query, [timeline_id]);
  }

  async deleteTimeline(timeline_id) {
  const query = 'DELETE FROM timeline WHERE timeline_id = $1';
  await pool.query(query, [timeline_id]);
}

}
