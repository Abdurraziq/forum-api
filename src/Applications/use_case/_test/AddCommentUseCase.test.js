const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const fakeNewCommentPayload = {
      content: 'comment',
      owner: 'user-xxx',
      threadId: 'thread-xxx'
    }

    const fakeAddedComment = new AddedComment({
      id: 'comment-1',
      content: fakeNewCommentPayload.content,
      owner: fakeNewCommentPayload.owner
    })

    const expectedAddedComment = new AddedComment({
      id: 'comment-1',
      content: fakeNewCommentPayload.content,
      owner: fakeNewCommentPayload.owner
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    // Mocking
    mockThreadRepository.verifyAvailableThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.addCommentToThread = jest.fn()
      .mockImplementation(() => Promise.resolve(fakeAddedComment))

    // create use case instance
    const addCommentdUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const actualAddedComment = await addCommentdUseCase
      .execute(fakeNewCommentPayload)

    // Assert
    expect(actualAddedComment).toStrictEqual(expectedAddedComment)
    expect(mockThreadRepository.verifyAvailableThreadById)
      .toBeCalledWith(fakeNewCommentPayload.threadId)
    expect(mockCommentRepository.addCommentToThread)
      .toBeCalledWith(fakeNewCommentPayload)
  })
})
