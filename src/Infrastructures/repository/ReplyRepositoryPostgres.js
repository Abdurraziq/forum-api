const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const Reply = require('../../Domains/replies/entities/Reply')

class ReplyRepositoryPostgres extends ReplyRepository {
  #pool
  #idGenerator

  constructor (pool, idGenerator) {
    super()
    this.#pool = pool
    this.#idGenerator = idGenerator
  }

  async addReplyToComment ({ content, owner, commentId }) {
    const id = `reply-${this.#idGenerator(20)}`
    const query = {
      text: `INSERT INTO replies
                   VALUES($1, $2, $3, $4)
                   RETURNING id, content, owner`,
      values: [id, content, owner, commentId]
    }
    const { rows } = await this.#pool.query(query)
    return new AddedReply(rows[0])
  }

  async verifyAvailableReply ({ replyId, commentId, threadId }) {
    const query = {
      text: `SELECT replies.is_deleted
                   FROM replies
                   INNER JOIN comments
                       ON replies.comment_id = comments.id
                   WHERE replies.id = $1 AND
                       comments.id = $2 AND comments.thread_id = $3`,
      values: [replyId, commentId, threadId]
    }
    const { rows, rowCount } = await this.#pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan')
    }

    if (rows[0].is_deleted) {
      throw new NotFoundError('Balasan telah dihapus')
    }
  }

  async verifyOwnershipOfReply ({ replyId, owner }) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner]
    }
    const { rowCount } = await this.#pool.query(query)

    if (!rowCount) {
      throw new AuthorizationError('Anda tidak memiliki hak atas balasan ini')
    }
  }

  async deleteReplyById (replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [replyId]
    }
    await this.#pool.query(query)
  }

  async getRepliesByCommentId (commentId) {
    const query = {
      text: `SELECT replies.id, users.username,
                       to_char(replies.date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as date,
                       CASE replies.is_deleted
                           WHEN TRUE THEN '**balasan telah dihapus**'
                           ELSE content
                       END as content
                   FROM replies
                   INNER JOIN users
                       ON replies.owner = users.id
                   WHERE replies.comment_id = $1
                   ORDER BY replies.date ASC`,
      values: [commentId]
    }

    const { rows } = await this.#pool.query(query)
    const replies = rows.map((reply) => new Reply(reply))
    return replies
  }
}

module.exports = ReplyRepositoryPostgres
