class DeleteCommentUseCase {
  #commentRepository

  constructor ({ commentRepository }) {
    this.#commentRepository = commentRepository
  }

  async execute (payload) {
    this.#verifyPayload(payload)
    const { owner, threadId, commentId } = payload

    await this.#commentRepository
      .verifyAvailableComment({ commentId, threadId })
    await this.#commentRepository
      .verifyOwnershipOfComment({ commentId, owner })
    await this.#commentRepository
      .deleteCommentById(commentId)
  }

  #verifyPayload ({ owner, threadId, commentId }) {
    if (owner === undefined ||
            threadId === undefined ||
            commentId === undefined
    ) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof owner !== 'string' ||
            typeof threadId !== 'string' ||
            typeof commentId !== 'string'
    ) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DeleteCommentUseCase
