import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js'
import AddedReply from '../../../Domains/replies/entities/AddedReply.js'
import AddReplyUseCase from '../AddReplyUseCase.js'

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const fakeNewReplyPayload = {
      content: 'comment',
      owner: 'user-xxx',
      commentId: 'comment-xxx',
      threadId: 'thread-xxx'
    }

    const fakeAddedReply = new AddedReply({
      id: 'reply-1',
      content: fakeNewReplyPayload.content,
      owner: fakeNewReplyPayload.owner
    })

    const expectedAddedReply = new AddedReply({
      id: 'reply-1',
      content: fakeNewReplyPayload.content,
      owner: fakeNewReplyPayload.owner
    })

    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    // Mocking
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.addReplyToComment = jest.fn()
      .mockImplementation(() => Promise.resolve(fakeAddedReply))

    // create use case instance
    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const actualAddedReply = await addReplyUseCase
      .execute(fakeNewReplyPayload)

    // Assert
    const { content, owner, commentId, threadId } = fakeNewReplyPayload
    expect(actualAddedReply).toStrictEqual(expectedAddedReply)
    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith({ commentId, threadId })
    expect(mockReplyRepository.addReplyToComment)
      .toBeCalledWith({ content, owner, commentId })
  })
})
