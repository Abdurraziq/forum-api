import InvariantError from '../../Commons/exceptions/InvariantError.js'
import RegisteredUser from '../../Domains/users/entities/RegisteredUser.js'
import UserRepository from '../../Domains/users/UserRepository.js'

export default class UserRepositoryPostgres extends UserRepository {
  #pool
  #idGenerator

  constructor (pool, idGenerator) {
    super()
    this.#pool = pool
    this.#idGenerator = idGenerator
  }

  async verifyAvailableUsername (username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this.#pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia')
    }
  }

  async addUser (registerUser) {
    const { username, password, fullname } = registerUser
    const id = `user-${this.#idGenerator(20)}`

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname]
    }

    const result = await this.#pool.query(query)

    return new RegisteredUser({ ...result.rows[0] })
  }

  async getPasswordByUsername (username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan')
    }

    return result.rows[0].password
  }

  async getIdByUsername (username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan')
    }

    const { id } = result.rows[0]

    return id
  }
}
