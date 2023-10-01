import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import AddedComment from '../../../Domains/comments/entities/AddedComment.js'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import AddCommentUseCase from '../AddCommentUseCase.js'

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
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const actualAddedComment = await addCommentUseCase
      .execute(fakeNewCommentPayload)

    // Assert
    expect(actualAddedComment).toStrictEqual(expectedAddedComment)
    expect(mockThreadRepository.verifyAvailableThreadById)
      .toBeCalledWith(fakeNewCommentPayload.threadId)
    expect(mockCommentRepository.addCommentToThread)
      .toBeCalledWith(fakeNewCommentPayload)
  })
})
