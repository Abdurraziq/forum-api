import NewThread from '../../Domains/threads/entities/NewThread.js'

export default class AddThreadUseCase {
  #threadRepository

  constructor ({ threadRepository }) {
    this.#threadRepository = threadRepository
  }

  async execute (payload) {
    const newThread = new NewThread(payload)
    return this.#threadRepository.addThread(newThread)
  }
}
