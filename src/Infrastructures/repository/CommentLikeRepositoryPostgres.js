import CommentLikeRepository from '../../Domains/comment_likes/CommentLikeRepository.js'

export default class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  #pool
  #idGenerator

  constructor (pool, idGenerator) {
    super()
    this.#pool = pool
    this.#idGenerator = idGenerator
  }

  async verifyUserIsLikedTheComment ({ userId, commentId }) {
    const query = {
      text: `SELECT id
             FROM comment_likes
             WHERE user_id = $1 AND comment_id = $2`,
      values: [userId, commentId]
    }
    const { rowCount } = await this.#pool.query(query)
    return rowCount !== 0
  }

  async addUserToLikedTheComment ({ userId, commentId }) {
    const id = `like-${this.#idGenerator(20)}`
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, userId, commentId]
    }
    await this.#pool.query(query)
  }

  async removeUserFromLikedTheComment ({ userId, commentId }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId]
    }
    await this.#pool.query(query)
  }

  async getCommentLikesCount (commentId) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1',
      values: [commentId]
    }
    const { rowCount } = await this.#pool.query(query)
    return rowCount
  }
}
