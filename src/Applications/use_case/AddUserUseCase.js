import RegisterUser from '../../Domains/users/entities/RegisterUser.js'

export default class AddUserUseCase {
  #userRepository
  #passwordHash

  constructor ({ userRepository, passwordHash }) {
    this.#userRepository = userRepository
    this.#passwordHash = passwordHash
  }

  async execute (useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload)
    await this.#userRepository.verifyAvailableUsername(registerUser.username)
    registerUser.password = await this.#passwordHash.hash(registerUser.password)
    return this.#userRepository.addUser(registerUser)
  }
}
