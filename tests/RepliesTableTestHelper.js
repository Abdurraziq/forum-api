/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

export default {
  async addReply ({
    id = 'reply-12345678901234567890',
    content = 'Replies',
    owner = 'user-12345678901234567890',
    commentId = 'comment-12345678901234567890'
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4)',
      values: [id, content, owner, commentId]
    }
    await pool.query(query)
  },

  async findReplyById (replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId]
    }
    const result = await pool.query(query)
    return result.rows
  },

  async softDeleteReplyById (replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [replyId]
    }
    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  }
}
