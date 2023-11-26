import CommentLikeRepository from '../../../Domains/comment_likes/CommentLikeRepository.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import LikeCommentUseCase from '../LikeCommentUseCase.js'

describe('LikeCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload1 = {}
    const useCasePayload2 = {
      userId: 'user-xxxx',
      commentId: 'comment-xxxx'
    }
    const useCasePayload3 = {
      userId: 'user-xxxx',
      threadId: 'thread-xxx'
    }
    const useCasePayload4 = {
      commentId: 'comment-xxxx',
      threadId: 'thread-xxx'
    }
    const likeCommentUseCase = new LikeCommentUseCase({})

    // Assert
    await expect(likeCommentUseCase.execute(useCasePayload1))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(likeCommentUseCase.execute(useCasePayload2))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(likeCommentUseCase.execute(useCasePayload3))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    await expect(likeCommentUseCase.execute(useCasePayload4))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload1 = {
      userId: {},
      commentId: false,
      threadId: null
    }
    const useCasePayload2 = {
      userId: [],
      commentId: 'comment-xxxx',
      threadId: 1234567
    }
    const useCasePayload3 = {
      userId: 0.001,
      commentId: true,
      threadId: 'thread-xxx'
    }
    const likeCommentUseCase = new LikeCommentUseCase({})

    // Assert
    await expect(likeCommentUseCase.execute(useCasePayload1))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    await expect(likeCommentUseCase.execute(useCasePayload2))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    await expect(likeCommentUseCase.execute(useCasePayload3))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const fakeLikeCommentPayload = {
      userId: 'user-xxxx',
      threadId: 'thread-xxx',
      commentId: 'comment-xxx'
    }

    const mockCommentRepository = new CommentRepository()
    const mockCommentLikeRepository = new CommentLikeRepository()

    // Mocking
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.verifyUserIsLikedTheComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false))
    mockCommentLikeRepository.addUserToLikedTheComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // create use case instance
    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository
    })

    // action
    await likeCommentUseCase.execute(fakeLikeCommentPayload)

    // assert
    const { userId, threadId, commentId } = fakeLikeCommentPayload
    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith({ commentId, threadId })
    expect(mockCommentLikeRepository.verifyUserIsLikedTheComment)
      .toBeCalledWith({ userId, commentId })
    expect(mockCommentLikeRepository.addUserToLikedTheComment)
      .toBeCalledWith({ userId, commentId })
  })

  it('should orchestrating the dislike comment action correctly', async () => {
    // Arrange
    const fakeLikeCommentPayload = {
      userId: 'user-xxxx',
      threadId: 'thread-xxx',
      commentId: 'comment-xxx'
    }

    const mockCommentRepository = new CommentRepository()
    const mockCommentLikeRepository = new CommentLikeRepository()

    // Mocking
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.verifyUserIsLikedTheComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true))
    mockCommentLikeRepository.removeUserFromLikedTheComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // create use case instance
    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository
    })

    // action
    await likeCommentUseCase.execute(fakeLikeCommentPayload)

    // assert
    const { userId, threadId, commentId } = fakeLikeCommentPayload
    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith({ commentId, threadId })
    expect(mockCommentLikeRepository.verifyUserIsLikedTheComment)
      .toBeCalledWith({ userId, commentId })
    expect(mockCommentLikeRepository.removeUserFromLikedTheComment)
      .toBeCalledWith({ userId, commentId })
  })
})
