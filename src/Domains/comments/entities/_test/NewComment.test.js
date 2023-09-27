const NewComment = require('../NewComment')

describe('an NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {}
    const payload2 = {
      owner: 'user-123',
      threadId: 'thread-123'
    }
    const payload3 = {
      content: 'comment',
      threadId: 'thread-123'
    }
    const payload4 = {
      content: 'comment',
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new NewComment(payload1))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new NewComment(payload2))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new NewComment(payload3))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new NewComment(payload4))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      content: null,
      owner: 'user-123',
      threadId: 'thread-123'
    }
    const payload2 = {
      content: 'comment',
      owner: 0,
      threadId: 'thread-123'
    }
    const payload3 = {
      content: 'comment',
      owner: 'user-123',
      threadId: false
    }

    // Action and Assert
    expect(() => new NewComment(payload1))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new NewComment(payload2))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new NewComment(payload3))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'comment',
      owner: 'user-123',
      threadId: 'thread-123'
    }

    // Action
    const newComment = new NewComment(payload)

    // Assert
    expect(newComment.content).toEqual(payload.content)
    expect(newComment.owner).toEqual(payload.owner)
    expect(newComment.threadId).toEqual(payload.threadId)
  })
})
