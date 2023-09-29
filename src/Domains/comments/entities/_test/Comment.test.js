import Comment from '../Comment.js'

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      username: 'userx',
      date: '2023-09-18T07:19:09.775Z',
      content: 'comments'
    }
    const payload2 = {
      id: 'comment-xxxxxx',
      date: '2023-09-18T07:19:09.775Z',
      content: 'comments'
    }
    const payload3 = {
      id: 'comment-xxxxxx',
      username: 'userx',
      content: 'comments'
    }
    const payload4 = {
      id: 'comment-xxxxxx',
      username: 'userx',
      date: '2023-09-18T07:19:09.775Z'
    }

    // Action and Assert
    expect(() => new Comment(payload1))
      .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Comment(payload2))
      .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Comment(payload3))
      .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Comment(payload4))
      .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123456,
      username: 'userx',
      date: null,
      content: false
    }
    const payload2 = {
      id: null,
      username: 'userx',
      date: {},
      content: []
    }
    const payload3 = {
      id: 123_345.00,
      username: 'userx',
      date: {},
      content: true
    }

    // Action and Assert
    expect(() => new Comment(payload1))
      .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new Comment(payload2))
      .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new Comment(payload3))
      .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-xxxxxx',
      username: 'userx',
      date: '2023-09-18T07:19:09.775Z',
      content: 'comments'
    }

    // Action
    const comment = new Comment(payload)

    // Assert
    expect(comment.id).toEqual(payload.id)
    expect(comment.username).toEqual(payload.username)
    expect(comment.date).toEqual(payload.date)
    expect(comment.content).toEqual(payload.content)
  })
})
