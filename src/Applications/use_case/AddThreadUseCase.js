const NewThread = require('../../Domains/threads/entities/NewThread')

class AddThreadUseCase {
  #threadRepository

  constructor ({ threadRepository }) {
    this.#threadRepository = threadRepository
  }

  async execute (payload) {
    const newThread = new NewThread(payload)
    return this.#threadRepository.addThread(newThread)
  }
}

module.exports = AddThreadUseCase
