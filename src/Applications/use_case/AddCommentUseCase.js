import NewComment from '../../Domains/comments/entities/NewComment.js'

export default class AddCommentUseCase {
  #threadRepository
  #commentRepository

  constructor ({ threadRepository, commentRepository }) {
    this.#threadRepository = threadRepository
    this.#commentRepository = commentRepository
  }

  async execute (payload) {
    const newComment = new NewComment(payload)
    await this.#threadRepository.verifyAvailableThreadById(newComment.threadId)
    return await this.#commentRepository.addCommentToThread(newComment)
  }
}
