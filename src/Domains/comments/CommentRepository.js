class CommentRepository {
  async addCommentToThread ({ comment }) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableComment ({ commentId, threadId }) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyOwnershipOfComment ({ commentId, owner }) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteCommentById (commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentsByThreadId (threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentRepository
