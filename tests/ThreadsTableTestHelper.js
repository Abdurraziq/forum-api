/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

export default {
  async addThread ({
    id = 'thread-12345678901234567890',
    title = 'Threads title',
    body = 'Treads body content',
    owner = 'user-12345678901234567890'
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, title, body, owner]
    }
    await pool.query(query)
  },

  async findThreadsById (id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }
    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}
