export default class DeleteReplyUseCase {
  #replyRepository

  constructor ({ replyRepository }) {
    this.#replyRepository = replyRepository
  }

  async execute (payload) {
    this.#verifyPayload(payload)
    const { owner, replyId, commentId, threadId } = payload
    await this.#replyRepository
      .verifyAvailableReply({ replyId, commentId, threadId })
    await this.#replyRepository
      .verifyOwnershipOfReply({ owner, replyId })
    await this.#replyRepository.deleteReplyById(payload.replyId)
  }

  #verifyPayload ({ owner, replyId, commentId, threadId }) {
    if (owner === undefined ||
            replyId === undefined ||
            commentId === undefined ||
            threadId === undefined
    ) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof owner !== 'string' ||
            typeof replyId !== 'string' ||
            typeof commentId !== 'string' ||
            typeof threadId !== 'string'
    ) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
