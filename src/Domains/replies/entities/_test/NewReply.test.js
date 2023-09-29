import NewReply from '../NewReply.js'

describe('an NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      owner: 'user-xxx',
      commentId: 'comment-001',
      threadId: 'thread-xxx'
    }
    const payload2 = {
      content: 'reply',
      commentId: 'comment-001',
      threadId: 'thread-xxx'
    }
    const payload3 = {
      content: 'reply',
      owner: 'user-xxx',
      threadId: 'thread-xxx'
    }
    const payload4 = {
      content: 'reply',
      owner: 'user-xxx',
      commentId: 'comment-001'
    }

    // Action and Assert
    expect(() => new NewReply(payload1))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new NewReply(payload2))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new NewReply(payload3))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new NewReply(payload4))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      content: false,
      owner: null,
      commentId: 'comment-001',
      threadId: []
    }
    const payload2 = {
      content: 'reply',
      owner: [],
      commentId: {},
      threadId: 1.000
    }
    const payload3 = {
      content: true,
      owner: 'user-xxx',
      commentId: 10000,
      threadId: null
    }

    // Action and Assert
    expect(() => new NewReply(payload1))
      .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new NewReply(payload2))
      .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new NewReply(payload3))
      .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'reply',
      owner: 'user-xxx',
      commentId: 'comment-001',
      threadId: 'thread-xxx'
    }

    // Action
    const newReply = new NewReply(payload)

    // Assert
    expect(newReply.content).toEqual(payload.content)
    expect(newReply.owner).toEqual(payload.owner)
    expect(newReply.commentId).toEqual(payload.commentId)
  })
})
