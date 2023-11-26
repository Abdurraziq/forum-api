export default class LikeCommentUseCase {
  #commentRepository
  #commentLikeRepository

  constructor ({ commentRepository, commentLikeRepository }) {
    this.#commentRepository = commentRepository
    this.#commentLikeRepository = commentLikeRepository
  }

  async execute (payload) {
    this.#verifyPayload(payload)
    const { userId, commentId, threadId } = payload

    await this.#commentRepository
      .verifyAvailableComment({ commentId, threadId })

    const isCommentLikedByUser = await this.#commentLikeRepository
      .verifyUserIsLikedTheComment({ userId, commentId })

    isCommentLikedByUser
      ? await this.#commentLikeRepository.removeUserFromLikedTheComment({ userId, commentId })
      : await this.#commentLikeRepository.addUserToLikedTheComment({ userId, commentId })
  }

  #verifyPayload ({ userId, commentId, threadId }) {
    if (userId === undefined ||
        commentId === undefined ||
        threadId === undefined
    ) {
      throw new Error('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof userId !== 'string' ||
        typeof commentId !== 'string' ||
        typeof threadId !== 'string'
    ) {
      throw new Error('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
