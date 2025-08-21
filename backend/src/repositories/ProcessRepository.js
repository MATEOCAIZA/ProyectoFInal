import pool from '../config/db.js';

export class ProcessRepository {
  async create(process) {
    const query = 'INSERT INTO process (title, type, offense, last_update, denounced, denouncer, province, carton, account_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *';
    const values = [
      process.title,
      process.type,
      process.offense,
      process.last_update,
      process.denounced,
      process.denouncer,
      process.province,
      process.carton,
      process.account_id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }
 
  async findById(process_id) {
    const query = 'SELECT * FROM process WHERE process_id = $1';
    const { rows } = await pool.query(query, [process_id]);
    return rows[0] || null;
  }

  async findByAccountId(account_id) {
  const query = 'SELECT * FROM process WHERE account_id = $1';
  const { rows } = await pool.query(query, [account_id]);
  return rows;
}


  async update(process) {
  const now = new Date(); 
  const query = `
    UPDATE process SET
      title = COALESCE($1, title),
      type = COALESCE($2, type),
      offense = COALESCE($3, offense),
      last_update = COALESCE($4, last_update),
      denounced = COALESCE($5, denounced),
      denouncer = COALESCE($6, denouncer),
      province = COALESCE($7, province),
      carton = COALESCE($8, carton)
    WHERE process_id = $9
    RETURNING *;
  `;
  const values = [
    process.title,
    process.type,
    process.offense,
    process.last_update || now ,
    process.denounced,
    process.denouncer,
    process.province,
    process.carton,
    process.process_id,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}


  async delete(process_id) {
    const query = 'DELETE FROM process WHERE process_id = $1';
    await pool.query(query, [process_id]);
  }

  async findAll() {
    const query = 'SELECT * FROM process ORDER BY last_update DESC';
    const { rows } = await pool.query(query);
    return rows;
  }
}
