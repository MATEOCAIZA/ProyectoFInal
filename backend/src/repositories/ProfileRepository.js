import pool from '../config/db.js';

export class ProfileRepository {
  async create(profile) {
    const query = 'INSERT INTO profile (content, account_id) VALUES ($1, $2) RETURNING *';
    const values = [profile.content, profile.account_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByAccountId(account_id) {
    const query = 'SELECT * FROM profile WHERE account_id = $1';
    const { rows } = await pool.query(query, [account_id]);
    return rows[0];
  }

  async update(profile) {
    const query = 'UPDATE profile SET content = $1 WHERE profile_id = $2 RETURNING *';
    const values = [profile.content, profile.profile_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}
