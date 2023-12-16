export default class GetHealthStatusUseCase {
  #healthStatusRepository

  constructor ({ healthStatusRepository }) {
    this.#healthStatusRepository = healthStatusRepository
  }

  async execute () {
    await this.#healthStatusRepository.getStatus()
  }
}
