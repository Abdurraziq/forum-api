/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

export default {
  async addUser ({
    id = 'user-12345678901234567890',
    username = 'userx',
    password = 'secret',
    fullname = 'User x fullname'
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname]
    }
    await pool.query(query)
  },

  async findUsersById (id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }
    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM users WHERE 1=1')
  }
}
