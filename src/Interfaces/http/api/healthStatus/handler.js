import GetHealthStatusUseCase from '../../../../Applications/use_case/GetHealthStatusUseCase.js'

export default class HealthStatusHandler {
  #container

  constructor (container) {
    this.#container = container

    this.getHealthStatus = this.getHealthStatus.bind(this)
  }

  async getHealthStatus () {
    const getHealthStatusUseCase = this.#container.getInstance(GetHealthStatusUseCase.name)
    await getHealthStatusUseCase.execute()
    return {
      status: 'ok'
    }
  }
}
