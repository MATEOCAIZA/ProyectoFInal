import pool from '../config/db.js';

export class AccountRepository {
  async create(account) {
    const query = 'INSERT INTO account (username, password, email, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [account.username, account.password, account.email, account.phone_number, account.role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByUsername(username) {
    const query = 'SELECT * FROM account WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }


  async findById(account_id) {
    const query = 'SELECT * FROM account WHERE account_id = $1';
    const { rows } = await pool.query(query, [account_id]);
    return rows[0];
  }

  async update(account) {
    const query = `
      UPDATE account SET email = $1, phone_number = $2, password = $3 WHERE account_id = $4 RETURNING *`;
    const values = [account.email, account.phone_number, account.password, account.account_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM account WHERE email = $1';
    const values = [email];
    const { rows } = await pool.query(query, values);
    return rows[0]; // Devuelve el primer usuario con ese email
  
}

async findWithProfile(account_id) {
  const query = `
    SELECT 
      a.account_id, a.username, a.email, a.phone_number, a.role,
      p.content
    FROM account a
    LEFT JOIN profile p ON a.account_id = p.account_id
    WHERE a.account_id = $1
  `;
  const { rows } = await pool.query(query, [account_id]);
  return rows[0];
}



}
