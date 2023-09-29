import NewReply from '../../Domains/replies/entities/NewReply.js'

export default class AddReplyUseCase {
  #commentRepository
  #replyRepository

  constructor ({ commentRepository, replyRepository }) {
    this.#commentRepository = commentRepository
    this.#replyRepository = replyRepository
  }

  async execute (payload) {
    const { content, owner, commentId, threadId } = new NewReply(payload)
    await this.#commentRepository
      .verifyAvailableComment({ commentId, threadId })
    return this.#replyRepository
      .addReplyToComment({ content, owner, commentId })
  }
}
