const AddedReply = require('../AddedReply')

describe('an AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'reply-xxxx',
      content: 'reply'
    }
    const payload2 = {
      id: 'reply-xxxx',
      owner: 'user-xxxx'
    }
    const payload3 = {
      content: 'reply',
      owner: 'user-xxxx'
    }

    // Action and Assert
    expect(() => new AddedReply(payload1))
      .toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new AddedReply(payload2))
      .toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new AddedReply(payload3))
      .toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 12345,
      content: null,
      owner: false
    }
    const payload2 = {
      id: '12345',
      content: {},
      owner: []
    }
    const payload3 = {
      id: 12345,
      content: null,
      owner: true
    }

    // Action and Assert
    expect(() => new AddedReply(payload1))
      .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new AddedReply(payload2))
      .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new AddedReply(payload3))
      .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-xxxxxx',
      content: 'reply',
      owner: 'user-xxxxxx'
    }

    // Action
    const addedReply = new AddedReply(payload)

    // Assert
    expect(addedReply.id).toEqual(payload.id)
    expect(addedReply.owner).toEqual(payload.owner)
    expect(addedReply.content).toEqual(payload.content)
  })
})
