import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import DeleteCommentUseCase from '../DeleteCommentUseCase.js'

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload1 = {}
    const useCasePayload2 = {
      owner: 'user-xxx',
      threadId: 'thread-xxx'
    }
    const useCasePayload3 = {
      commentId: 'comment-xxx',
      threadId: 'thread-xxx'
    }
    const useCasePayload4 = {
      owner: 'user-xxx',
      threadId: 'thread-xxx'
    }
    const deleteCommentUseCase = new DeleteCommentUseCase({})

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload1))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(deleteCommentUseCase.execute(useCasePayload2))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(deleteCommentUseCase.execute(useCasePayload3))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(deleteCommentUseCase.execute(useCasePayload4))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload1 = {
      owner: false,
      threadId: null,
      commentId: 1234
    }
    const useCasePayload2 = {
      owner: null,
      threadId: false,
      commentId: {}
    }
    const useCasePayload3 = {
      owner: [],
      threadId: 1_000,
      commentId: 12.22
    }
    const deleteCommentUseCase = new DeleteCommentUseCase({})

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload1))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    await expect(deleteCommentUseCase.execute(useCasePayload2))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    await expect(deleteCommentUseCase.execute(useCasePayload3))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const fakeDeleteCommentPayload = {
      owner: 'user-xxx',
      threadId: 'thread-xxx',
      commentId: 'comment-xxx'
    }

    const mockCommentRepository = new CommentRepository()

    // Mocking
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyOwnershipOfComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository
    })

    // Action
    await deleteCommentUseCase.execute(fakeDeleteCommentPayload)

    // Assert
    const { owner, threadId, commentId } = fakeDeleteCommentPayload
    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith({ commentId, threadId })
    expect(mockCommentRepository.verifyOwnershipOfComment)
      .toBeCalledWith({ commentId, owner })
    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith(fakeDeleteCommentPayload.commentId)
  })
})
