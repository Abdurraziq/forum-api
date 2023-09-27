const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const Comment = require('../../Domains/comments/entities/Comment')

class CommentRepositoryPostgres extends CommentRepository {
  #pool
  #idGenerator

  constructor (pool, idGenerator) {
    super()
    this.#pool = pool
    this.#idGenerator = idGenerator
  }

  async addCommentToThread ({ content, owner, threadId }) {
    const id = `comment-${this.#idGenerator(20)}`
    const query = {
      text: `INSERT INTO comments
                   VALUES($1, $2, $3, $4)
                   RETURNING id, content, owner`,
      values: [id, content, owner, threadId]
    }
    const { rows } = await this.#pool.query(query)
    return new AddedComment(rows[0])
  }

  async verifyAvailableComment ({ commentId, threadId }) {
    const query = {
      text: `SELECT is_deleted
                   FROM comments
                   WHERE id = $1 AND thread_id = $2`,
      values: [commentId, threadId]
    }
    const { rows, rowCount } = await this.#pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('Komentar dalam thread tidak ditemukan')
    }

    if (rows[0].is_deleted) {
      throw new NotFoundError('Komentar telah dihapus')
    }
  }

  async verifyOwnershipOfComment ({ commentId, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner]
    }
    const { rowCount } = await this.#pool.query(query)

    if (!rowCount) {
      throw new AuthorizationError('Anda tidak memiliki hak atas komentar ini')
    }
  }

  async deleteCommentById (commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
      values: [commentId]
    }
    await this.#pool.query(query)
  }

  async getCommentsByThreadId (threadId) {
    const query = {
      text: `SELECT comments.id, users.username,
                       to_char(date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as date,
                       CASE is_deleted
                           WHEN TRUE THEN '**komentar telah dihapus**'
                           ELSE content
                       END as content
                   FROM comments
                   INNER JOIN users
                       ON comments.owner = users.id
                   WHERE comments.thread_id = $1
                   ORDER BY comments.date ASC`,
      values: [threadId]
    }
    const { rows } = await this.#pool.query(query)
    const comments = rows.map((comment) => new Comment(comment))
    return comments
  }
}

module.exports = CommentRepositoryPostgres
