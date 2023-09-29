import InvariantError from '../../Commons/exceptions/InvariantError.js'
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository.js'

export default class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  #pool

  constructor (pool) {
    super()
    this.#pool = pool
  }

  async addToken (token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token]
    }

    await this.#pool.query(query)
  }

  async checkAvailabilityToken (token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token]
    }

    const result = await this.#pool.query(query)

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database')
    }
  }

  async deleteToken (token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    }

    await this.#pool.query(query)
  }
}
