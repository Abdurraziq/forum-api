import Reply from '../Reply.js'

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      username: 'userx',
      date: '2023-09-18T07:19:09.775Z',
      content: 'reply'
    }
    const payload2 = {
      id: 'reply-xxxxxx',
      date: '2023-09-18T07:19:09.775Z',
      content: 'reply'
    }
    const payload3 = {
      id: 'reply-xxxxxx',
      username: 'userx',
      content: 'reply'
    }
    const payload4 = {
      id: 'reply-xxxxxx',
      username: 'userx',
      date: '2023-09-18T07:19:09.775Z'
    }

    // Action and Assert
    expect(() => new Reply(payload1))
      .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Reply(payload2))
      .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Reply(payload3))
      .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Reply(payload4))
      .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 12345,
      content: null,
      username: false,
      date: '2023-09-18T07:19:09.775Z'
    }
    const payload2 = {
      id: 12345,
      content: null,
      username: false,
      date: '2023-09-18T07:19:09.775Z'
    }
    const payload3 = {
      id: 12345,
      content: {},
      username: [],
      date: null
    }

    // Action and Assert
    expect(() => new Reply(payload1))
      .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new Reply(payload2))
      .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new Reply(payload3))
      .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-xxxxxx',
      username: 'userx',
      date: '2023-09-18T07:19:09.775Z',
      content: 'reply'
    }

    // Action
    const reply = new Reply(payload)

    // Assert
    expect(reply.id).toEqual(payload.id)
    expect(reply.username).toEqual(payload.username)
    expect(reply.date).toEqual(payload.date)
    expect(reply.content).toEqual(payload.content)
  })
})
