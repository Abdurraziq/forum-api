/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

export default {
  async addCommentLike ({
    id = 'like-12345678901234567890',
    userId = 'user-12345678901234567890',
    commentId = 'comment-12345678901234567890'
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, userId, commentId]
    }
    await pool.query(query)
  },

  async findCommentByUserAndCommentId ({ userId, commentId }) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId]
    }
    const result = await pool.query(query)
    return result.rows
  },

  async findCommentLikeById (id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id]
    }
    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comment_likes WHERE 1=1')
  }
}
