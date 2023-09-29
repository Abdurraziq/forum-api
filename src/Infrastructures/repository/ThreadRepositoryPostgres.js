import NotFoundError from '../../Commons/exceptions/NotFoundError.js'
import ThreadRepository from '../../Domains/threads/ThreadRepository.js'
import AddedThread from '../../Domains/threads/entities/AddedThread.js'
import Thread from '../../Domains/threads/entities/Thread.js'

export default class ThreadRepositoryPostgres extends ThreadRepository {
  #pool
  #idGenerator

  constructor (pool, idGenerator) {
    super()
    this.#pool = pool
    this.#idGenerator = idGenerator
  }

  async addThread ({ title, body, owner }) {
    const id = `thread-${this.#idGenerator(20)}`
    const query = {
      text: `INSERT INTO threads
                   VALUES($1, $2, $3, $4)
                   RETURNING id, title, owner`,
      values: [id, title, body, owner]
    }

    const { rows } = await this.#pool.query(query)
    return new AddedThread(rows[0])
  }

  async verifyAvailableThreadById (threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId]
    }

    const { rowCount } = await this.#pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }
  }

  async getThreadById (threadId) {
    const query = {
      text: `SELECT threads.id, title, body, username,
                       to_char(date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as date
                   FROM threads
                   INNER JOIN users
                       ON threads.owner = users.id
                   WHERE threads.id = $1`,
      values: [threadId]
    }

    const { rows, rowCount } = await this.#pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }
    return new Thread(rows[0])
  }
}
