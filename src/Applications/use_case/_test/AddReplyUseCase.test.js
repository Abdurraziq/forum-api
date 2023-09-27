const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const AddReplyUseCase = require('../AddReplyUseCase')

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
    const addReplydUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const actualAddedReply = await addReplydUseCase
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
