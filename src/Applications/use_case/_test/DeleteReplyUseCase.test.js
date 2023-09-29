import ReplyRepository from '../../../Domains/replies/ReplyRepository.js'
import DeleteReplyUseCase from '../DeleteReplyUseCase.js'

describe('DeletCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload1 = {
      replyId: 'reply-xxx',
      commentId: 'comment-xxx',
      threadId: 'thread-xxx'
    }
    const useCasePayload2 = {
      owner: 'user-xxx',
      commentId: 'comment-xxx',
      threadId: 'thread-xxx'
    }
    const useCasePayload3 = {
      owner: 'user-xxx',
      replyId: 'reply-xxx',
      threadId: 'thread-xxx'
    }
    const useCasePayload4 = {
      owner: 'user-xxx',
      replyId: 'reply-xxx',
      commentId: 'comment-xxx'
    }

    const deleteReplyUseCase = new DeleteReplyUseCase({})

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload1))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(deleteReplyUseCase.execute(useCasePayload2))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(deleteReplyUseCase.execute(useCasePayload3))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(deleteReplyUseCase.execute(useCasePayload4))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload1 = {
      owner: false,
      replyId: 1234,
      commentId: [],
      threadId: 1.000
    }
    const useCasePayload2 = {
      owner: null,
      replyId: {},
      commentId: [],
      threadId: '1.000'
    }
    const useCasePayload3 = {
      owner: [],
      replyId: 12.22,
      commentId: true,
      threadId: null
    }
    const deleteReplyUseCase = new DeleteReplyUseCase({})

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload1))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    await expect(deleteReplyUseCase.execute(useCasePayload2))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    await expect(deleteReplyUseCase.execute(useCasePayload3))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const fakeDeleteReplyPayload = {
      owner: 'user-xxx',
      replyId: 'reply-xxx',
      commentId: 'comment-xxx',
      threadId: 'thread-xxx'
    }

    const mockReplyRepository = new ReplyRepository()

    // Mocking
    mockReplyRepository.verifyAvailableReply = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.verifyOwnershipOfReply = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository
    })

    // Action
    await deleteReplyUseCase.execute(fakeDeleteReplyPayload)

    // Assert
    const { owner, replyId, commentId, threadId } = fakeDeleteReplyPayload

    expect(mockReplyRepository.verifyAvailableReply)
      .toBeCalledWith({ replyId, commentId, threadId })
    expect(mockReplyRepository.verifyOwnershipOfReply)
      .toBeCalledWith({ owner, replyId })
    expect(mockReplyRepository.deleteReplyById)
      .toBeCalledWith(replyId)
  })
})
