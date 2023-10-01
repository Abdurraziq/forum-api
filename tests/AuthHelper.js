/* istanbul ignore file */
import { token } from '@hapi/jwt'

export default {
  async generateAccessToken ({ username, id: userId }) {
    return token.generate(
      { username, userId },
      process.env.ACCESS_TOKEN_KEY
    )
  }
}
