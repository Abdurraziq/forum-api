export default class CommentLikeRepository {
  async verifyUserIsLikedTheComment ({ userId, commentId }) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async addUserToLikedTheComment ({ userId, commentId }) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async removeUserFromLikedTheComment ({ userId, commentId }) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentLikesCount (commentId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}
