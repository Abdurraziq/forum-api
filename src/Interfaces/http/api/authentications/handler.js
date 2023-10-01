import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase.js'
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase.js'
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase.js'

export default class AuthenticationsHandler {
  #container

  constructor (container) {
    this.#container = container

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler (request, h) {
    const loginUserUseCase = this.#container.getInstance(LoginUserUseCase.name)
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload)
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthenticationHandler (request) {
    const refreshAuthenticationUseCase = this.#container
      .getInstance(RefreshAuthenticationUseCase.name)
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload)

    return {
      status: 'success',
      data: {
        accessToken
      }
    }
  }

  async deleteAuthenticationHandler (request) {
    const logoutUserUseCase = this.#container.getInstance(LogoutUserUseCase.name)
    await logoutUserUseCase.execute(request.payload)
    return {
      status: 'success'
    }
  }
}
