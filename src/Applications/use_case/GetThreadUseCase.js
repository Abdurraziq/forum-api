class GetThreadUseCase {
  #threadRepository
  #commentRepository
  #replyRepository

  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository
    this.#commentRepository = commentRepository
    this.#replyRepository = replyRepository
  }

  async execute (threadId) {
    this.#validateThreadId(threadId)

    const thread = await this.#threadRepository.getThreadById(threadId)
    const comments = await this.#commentRepository.getCommentsByThreadId(threadId)

    const replyFromComment = async (commentId) => {
      return await this.#replyRepository.getRepliesByCommentId(commentId)
    }

    return {
      ...thread,
      comments: await Promise.all(comments.map(async comment => {
        return {
          ...comment,
          replies: await replyFromComment(comment.id)
        }
      }))
    }
  }

  #validateThreadId (threadId) {
    if (threadId === undefined) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID')
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.THREAD_ID_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = GetThreadUseCase
