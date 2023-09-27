const CommentRepository = require('../../../Domains/comments/CommentRepository')
const Comment = require('../../../Domains/comments/entities/Comment')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const Reply = require('../../../Domains/replies/entities/Reply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const Thread = require('../../../Domains/threads/entities/Thread')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
  it('should throw error when threadId is not given', async () => {
    const getThreadUseCase = new GetThreadUseCase({})

    // Action & Assert
    await expect(getThreadUseCase.execute())
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID')
  })

  it('should throw error when threadId is not string', async () => {
    const getThreadUseCase = new GetThreadUseCase({})

    // Action & Assert
    await expect(getThreadUseCase.execute(false))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.THREAD_ID_NOT_MEET_DATA_TYPE_SPECIFICATION')
    await expect(getThreadUseCase.execute({}))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.THREAD_ID_NOT_MEET_DATA_TYPE_SPECIFICATION')
    await expect(getThreadUseCase.execute(null))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.THREAD_ID_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const fakeThread = new Thread({
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body content',
      date: '2023-09-18T07:19:09.775Z',
      username: 'userx'
    })

    const fakeComments = [
      new Comment({
        id: 'comment-1',
        username: 'usery',
        date: '2023-09-18T07:19:09.775Z',
        content: 'comments 1'
      }),
      new Comment({
        id: 'comment-2',
        username: 'userz',
        date: '2023-09-18T07:19:09.775Z',
        content: 'comments 2'
      })
    ]

    const fakeReplies = [
      new Reply({
        id: 'reply-1',
        username: 'userxx',
        date: '2023-09-18T07:19:09.775Z',
        content: 'reply 1'
      }),
      new Reply({
        id: 'reply-2',
        username: 'useryy',
        date: '2023-09-18T07:19:09.775Z',
        content: 'reply 2'
      })
    ]

    const expectedDetailThread = {
      ...fakeThread,
      comments: fakeComments.map((comment) => {
        return {
          ...comment,
          replies: fakeReplies
        }
      })
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    // Mocking
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(fakeThread))
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(fakeComments))
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(fakeReplies))

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const actualDetailThread = await getThreadUseCase.execute(fakeThread.id)

    // Assert
    expect(actualDetailThread).toStrictEqual(expectedDetailThread)

    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(fakeThread.id)
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(fakeThread.id)

    expect(mockReplyRepository.getRepliesByCommentId)
      .toBeCalledTimes(2)

    expect(mockReplyRepository.getRepliesByCommentId)
      .toBeCalledWith(fakeComments[0].id)
    expect(mockReplyRepository.getRepliesByCommentId)
      .toBeCalledWith(fakeComments[1].id)
  })
})
