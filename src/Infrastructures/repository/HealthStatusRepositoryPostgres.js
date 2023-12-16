import HealthStatusRepository from '../../Domains/health-status/HealthStatusRepository.js'

export default class HealthStatusRepositoryPostgres extends HealthStatusRepository {
  #pool

  constructor (pool) {
    super()
    this.#pool = pool
  }

  // Get DB status
  async getStatus () {
    const client = await this.#pool.connect()
    client.release()
  }
}
