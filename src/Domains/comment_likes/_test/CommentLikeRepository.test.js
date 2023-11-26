import CommentLikeRepository from '../CommentLikeRepository.js'

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository()

    // Action & Assert
    await expect(commentLikeRepository.verifyUserIsLikedTheComment({}))
      .rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentLikeRepository.addUserToLikedTheComment({}))
      .rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentLikeRepository.removeUserFromLikedTheComment({}))
      .rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentLikeRepository.getCommentLikesCount(''))
      .rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
