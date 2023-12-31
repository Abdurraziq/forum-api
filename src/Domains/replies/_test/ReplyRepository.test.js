import ReplyRepository from '../ReplyRepository.js'

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new ReplyRepository()

    // Action and Assert
    await expect(replyRepository.addReplyToComment({})).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.deleteReplyById({})).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.getRepliesByCommentId({})).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.verifyAvailableReply({})).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.verifyOwnershipOfReply({})).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
