import UserLogin from '../../Domains/users/entities/UserLogin.js'
import NewAuthentication from '../../Domains/authentications/entities/NewAuth.js'

export default class LoginUserUseCase {
  #userRepository
  #authenticationRepository
  #authenticationTokenManager
  #passwordHash

  constructor ({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash
  }) {
    this.#userRepository = userRepository
    this.#authenticationRepository = authenticationRepository
    this.#authenticationTokenManager = authenticationTokenManager
    this.#passwordHash = passwordHash
  }

  async execute (useCasePayload) {
    const { username, password } = new UserLogin(useCasePayload)

    const encryptedPassword = await this.#userRepository.getPasswordByUsername(username)

    await this.#passwordHash.comparePassword(password, encryptedPassword)

    const userId = await this.#userRepository.getIdByUsername(username)

    const accessToken = await this.#authenticationTokenManager
      .createAccessToken({ username, userId })
    const refreshToken = await this.#authenticationTokenManager
      .createRefreshToken({ username, userId })

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken
    })

    await this.#authenticationRepository.addToken(newAuthentication.refreshToken)

    return newAuthentication
  }
}
