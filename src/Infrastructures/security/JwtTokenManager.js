import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager.js'
import InvariantError from '../../Commons/exceptions/InvariantError.js'

export default class JwtTokenManager extends AuthenticationTokenManager {
  #jwt

  constructor (jwt) {
    super()
    this.#jwt = jwt
  }

  async createAccessToken (payload) {
    return this.#jwt.generate(payload, process.env.ACCESS_TOKEN_KEY)
  }

  async createRefreshToken (payload) {
    return this.#jwt.generate(payload, process.env.REFRESH_TOKEN_KEY)
  }

  async verifyRefreshToken (token) {
    try {
      const artifacts = this.#jwt.decode(token)
      this.#jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY)
    } catch (error) {
      throw new InvariantError('refresh token tidak valid')
    }
  }

  async decodePayload (token) {
    const artifacts = this.#jwt.decode(token)
    return artifacts.decoded.payload
  }
}
