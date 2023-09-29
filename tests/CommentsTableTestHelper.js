/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

export default {
  async addComment ({
    id = 'comment-123456789012345678901',
    content = 'Comment',
    owner = 'user-123456789012345678901',
    threadId = 'thread-123456789012345678901'
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, content, owner, threadId]
    }

    await pool.query(query)
  },

  async findCommentById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async softDeleteCommentById (commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
      values: [commentId]
    }

    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}
